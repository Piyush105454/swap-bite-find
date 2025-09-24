const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const logger = require('../shared/utils/logger');
const { apiLimiter } = require('../shared/middleware/rateLimiter');

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'api-gateway', 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// Service endpoints
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  food: process.env.FOOD_SERVICE_URL || 'http://localhost:3002',
  chat: process.env.CHAT_SERVICE_URL || 'http://localhost:3003',
  user: process.env.USER_SERVICE_URL || 'http://localhost:3004',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005'
};

// Proxy configuration
const createProxy = (target, pathRewrite = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onError: (err, req, res) => {
      logger.error('Proxy error:', { error: err.message, target, path: req.path });
      res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable',
        service: target
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      logger.info('Proxying request:', { 
        method: req.method, 
        path: req.path, 
        target 
      });
    }
  });
};

// Route proxies
app.use('/api/auth', createProxy(services.auth, { '^/api/auth': '/api/auth' }));
app.use('/api/food', createProxy(services.food, { '^/api/food': '/api/food' }));
app.use('/api/chat', createProxy(services.chat, { '^/api/chat': '/api/chat' }));
app.use('/api/user', createProxy(services.user, { '^/api/user': '/api/user' }));
app.use('/api/notifications', createProxy(services.notification, { '^/api/notifications': '/api/notifications' }));

// API documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'SwapEat API Gateway',
    version: '1.0.0',
    services: {
      auth: {
        url: '/api/auth',
        description: 'Authentication and authorization service',
        endpoints: [
          'POST /api/auth/register',
          'POST /api/auth/login',
          'POST /api/auth/logout',
          'POST /api/auth/refresh'
        ]
      },
      food: {
        url: '/api/food',
        description: 'Food items management service',
        endpoints: [
          'GET /api/food',
          'GET /api/food/:id',
          'POST /api/food',
          'PUT /api/food/:id',
          'DELETE /api/food/:id'
        ]
      },
      chat: {
        url: '/api/chat',
        description: 'Real-time messaging service',
        endpoints: [
          'GET /api/chat/conversations',
          'GET /api/chat/conversations/:id/messages',
          'POST /api/chat/conversations',
          'POST /api/chat/conversations/:id/messages'
        ]
      },
      user: {
        url: '/api/user',
        description: 'User profile management service',
        endpoints: [
          'GET /api/user/profile',
          'PUT /api/user/profile',
          'GET /api/user/stats'
        ]
      },
      notifications: {
        url: '/api/notifications',
        description: 'Notification management service',
        endpoints: [
          'GET /api/notifications',
          'PUT /api/notifications/:id/read',
          'POST /api/notifications/preferences'
        ]
      }
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Gateway error:', err);
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
    message: 'API endpoint not found',
    availableEndpoints: [
      '/api/auth/*',
      '/api/food/*',
      '/api/chat/*',
      '/api/user/*',
      '/api/notifications/*'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info('Service endpoints:', services);
});

module.exports = app;