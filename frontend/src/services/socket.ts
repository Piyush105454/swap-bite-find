import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    this.token = token;
    
    if (this.socket?.connected) {
      return this.socket;
    }

    const serverUrl = import.meta.env.VITE_CHAT_SERVICE_URL || 'http://localhost:3003';
    
    this.socket = io(serverUrl, {
      auth: {
        token: this.token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat service');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat service');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Chat methods
  joinConversation(conversationId: string) {
    this.socket?.emit('join_conversation', conversationId);
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('leave_conversation', conversationId);
  }

  sendMessage(conversationId: string, content: string) {
    this.socket?.emit('send_message', {
      conversationId,
      content
    });
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }

  onUserTyping(callback: (data: { userId: string; typing: boolean }) => void) {
    this.socket?.on('user_typing', callback);
  }

  startTyping(conversationId: string) {
    this.socket?.emit('typing_start', conversationId);
  }

  stopTyping(conversationId: string) {
    this.socket?.emit('typing_stop', conversationId);
  }

  onError(callback: (error: any) => void) {
    this.socket?.on('error', callback);
  }

  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  removeListener(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;