const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const logger = require('../../shared/utils/logger');
const database = require('../../config/database');
const chatRoutes = require('./routes/chat');
const { apiLimiter } = require('../../shared/middleware/rateLimiter');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.CHAT_SERVICE_PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    next();
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info('User connected to chat:', { 
    userId: socket.userId, 
    socketId: socket.id 
  });

  // Join user to their personal room
  socket.join(`user_${socket.userId}`);

  // Handle joining conversation rooms
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    logger.info('User joined conversation:', { 
      userId: socket.userId, 
      conversationId 
    });
  });

  // Handle leaving conversation rooms
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    logger.info('User left conversation:', { 
      userId: socket.userId, 
      conversationId 
    });
  });

  // Handle new messages
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, content } = data;
      const supabase = database.getClient();

      // Verify user is part of the conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .or(`participant_1_id.eq.${socket.userId},participant_2_id.eq.${socket.userId}`)
        .single();

      if (convError || !conversation) {
        socket.emit('error', { message: 'Unauthorized or conversation not found' });
        return;
      }

      // Save message to database
      const { data: message, error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: socket.userId,
          content: content.trim()
        })
        .select()
        .single();

      if (msgError) {
        throw msgError;
      }

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Emit message to all participants in the conversation
      io.to(`conversation_${conversationId}`).emit('new_message', {
        ...message,
        sender: {
          id: socket.userId,
          email: socket.userEmail
        }
      });

      logger.info('Message sent:', { 
        messageId: message.id, 
        conversationId, 
        senderId: socket.userId 
      });

    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (conversationId) => {
    socket.to(`conversation_${conversationId}`).emit('user_typing', {
      userId: socket.userId,
      typing: true
    });
  });

  socket.on('typing_stop', (conversationId) => {
    socket.to(`conversation_${conversationId}`).emit('user_typing', {
      userId: socket.userId,
      typing: false
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info('User disconnected from chat:', { 
      userId: socket.userId, 
      socketId: socket.id 
    });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'chat-service', 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/api/chat', chatRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Chat service error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Chat service endpoint not found'
  });
});

// Start server
const startServer = async () => {
  try {
    await database.connect();
    
    server.listen(PORT, () => {
      logger.info(`Chat service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start chat service:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };