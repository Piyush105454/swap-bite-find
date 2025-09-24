const express = require('express');
const { authenticateToken } = require('../../../shared/middleware/auth');
const ApiResponse = require('../../../shared/utils/response');
const logger = require('../../../shared/utils/logger');
const database = require('../../../config/database');

const router = express.Router();

// Get user conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const supabase = database.getClient();

    // Get conversations where user is a participant
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_1_id.eq.${req.user.id},participant_2_id.eq.${req.user.id}`)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Get other participants and last messages
    const enrichedConversations = await Promise.all(
      (conversations || []).map(async (conv) => {
        const otherUserId = conv.participant_1_id === req.user.id 
          ? conv.participant_2_id 
          : conv.participant_1_id;

        // Get other user profile
        const { data: otherUser } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', otherUserId)
          .single();

        // Get last message
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get unread count
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('conversation_id', conv.id)
          .neq('sender_id', req.user.id)
          .is('read_at', null);

        return {
          ...conv,
          other_user: otherUser || { id: otherUserId, full_name: 'Unknown User', avatar_url: null },
          last_message: lastMessage,
          unread_count: unreadCount || 0
        };
      })
    );

    res.json(
      ApiResponse.success(enrichedConversations, 'Conversations retrieved successfully')
    );

  } catch (error) {
    logger.error('Error fetching conversations:', error);
    res.status(500).json(
      ApiResponse.error('Failed to fetch conversations', 500)
    );
  }
});

// Get conversation messages
router.get('/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const supabase = database.getClient();

    // Verify user is part of the conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .or(`participant_1_id.eq.${req.user.id},participant_2_id.eq.${req.user.id}`)
      .single();

    if (convError || !conversation) {
      return res.status(404).json(
        ApiResponse.error('Conversation not found or unauthorized', 404)
      );
    }

    // Get messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', req.user.id)
      .is('read_at', null);

    res.json(
      ApiResponse.success(messages || [], 'Messages retrieved successfully')
    );

  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json(
      ApiResponse.error('Failed to fetch messages', 500)
    );
  }
});

// Create or get conversation
router.post('/conversations', authenticateToken, async (req, res) => {
  try {
    const { participant_id, food_request_id } = req.body;
    const supabase = database.getClient();

    if (!participant_id) {
      return res.status(400).json(
        ApiResponse.error('Participant ID is required', 400)
      );
    }

    if (participant_id === req.user.id) {
      return res.status(400).json(
        ApiResponse.error('Cannot create conversation with yourself', 400)
      );
    }

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant_1_id.eq.${req.user.id},participant_2_id.eq.${participant_id}),and(participant_1_id.eq.${participant_id},participant_2_id.eq.${req.user.id})`)
      .maybeSingle();

    if (existingConversation) {
      return res.json(
        ApiResponse.success(existingConversation, 'Existing conversation found')
      );
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from('conversations')
      .insert({
        participant_1_id: req.user.id,
        participant_2_id: participant_id,
        food_request_id: food_request_id || null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info('Conversation created:', { 
      conversationId: newConversation.id, 
      participants: [req.user.id, participant_id] 
    });

    res.status(201).json(
      ApiResponse.success(newConversation, 'Conversation created successfully', 201)
    );

  } catch (error) {
    logger.error('Error creating conversation:', error);
    res.status(500).json(
      ApiResponse.error('Failed to create conversation', 500)
    );
  }
});

// Send message (REST endpoint, also handled via Socket.IO)
router.post('/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const { content } = req.body;
    const supabase = database.getClient();

    if (!content || !content.trim()) {
      return res.status(400).json(
        ApiResponse.error('Message content is required', 400)
      );
    }

    // Verify user is part of the conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .or(`participant_1_id.eq.${req.user.id},participant_2_id.eq.${req.user.id}`)
      .single();

    if (convError || !conversation) {
      return res.status(404).json(
        ApiResponse.error('Conversation not found or unauthorized', 404)
      );
    }

    // Create message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: req.user.id,
        content: content.trim()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    logger.info('Message created via REST:', { 
      messageId: message.id, 
      conversationId, 
      senderId: req.user.id 
    });

    res.status(201).json(
      ApiResponse.success(message, 'Message sent successfully', 201)
    );

  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json(
      ApiResponse.error('Failed to send message', 500)
    );
  }
});

module.exports = router;