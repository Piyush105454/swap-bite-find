const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('phone_number').optional().isMobilePhone(),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateFoodItem = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['vegetables', 'fruits', 'grains', 'legumes', 'nuts', 'non-veg', 'baked', 'desserts', 'meals', 'processed', 'beverages']),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('unit').isIn(['kg', 'g', 'liters', 'ml', 'pieces', 'packs']),
  body('location_lat').isFloat({ min: -90, max: 90 }),
  body('location_lng').isFloat({ min: -180, max: 180 }),
  body('location_address').trim().isLength({ min: 5 }),
  body('expire_date').isISO8601().withMessage('Invalid expiry date'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateFoodItem,
  handleValidationErrors
};