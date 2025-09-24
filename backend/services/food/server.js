const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const multer = require('multer');
require('dotenv').config();

const logger = require('../../shared/utils/logger');
const database = require('../../config/database');
const foodRoutes = require('./routes/food');
const { apiLimiter } = require('../../shared/middleware/rateLimiter');

const app = express();
const PORT = process.env.FOOD_SERVICE_PORT || 3002;

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'food-service', 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/api/food', foodRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Food service error:', err);
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
    message: 'Food service endpoint not found'
  });
});

// Start server
const startServer = async () => {
  try {
    await database.connect();
    
    app.listen(PORT, () => {
      logger.info(`Food service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start food service:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;