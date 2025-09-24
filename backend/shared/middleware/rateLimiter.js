const { RateLimiterMemory } = require('rate-limiter-flexible');
const logger = require('../utils/logger');

const rateLimiters = {
  auth: new RateLimiterMemory({
    keyPrefix: 'auth',
    points: 5, // Number of requests
    duration: 900, // Per 15 minutes
  }),
  
  api: new RateLimiterMemory({
    keyPrefix: 'api',
    points: 100, // Number of requests
    duration: 60, // Per 1 minute
  }),
  
  upload: new RateLimiterMemory({
    keyPrefix: 'upload',
    points: 10, // Number of uploads
    duration: 3600, // Per 1 hour
  })
};

const createRateLimiter = (limiterName) => {
  return async (req, res, next) => {
    try {
      const limiter = rateLimiters[limiterName];
      if (!limiter) {
        return next();
      }

      const key = req.ip || req.connection.remoteAddress;
      await limiter.consume(key);
      next();
    } catch (rejRes) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      res.set('Retry-After', String(secs));
      
      logger.warn('Rate limit exceeded:', { 
        ip: req.ip, 
        limiter: limiterName,
        retryAfter: secs 
      });
      
      res.status(429).json({
        success: false,
        message: 'Too many requests',
        retryAfter: secs
      });
    }
  };
};

module.exports = {
  authLimiter: createRateLimiter('auth'),
  apiLimiter: createRateLimiter('api'),
  uploadLimiter: createRateLimiter('upload')
};