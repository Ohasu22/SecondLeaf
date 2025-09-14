const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const age = (new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365);
      if (age < 18) {
        throw new Error('You must be 18 or older to create an account');
      }
      return true;
    }),
  
  body('contactNumber')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid contact number'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('emailOrUsername')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateOTP = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
  
  body('type')
    .isIn(['verification', 'login', 'password_reset'])
    .withMessage('Invalid OTP type'),
  
  handleValidationErrors
];

// Product validation rules
const validateProductCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .isIn([
      'Electronics', 'Furniture', 'Clothing', 'Books', 'Appliances',
      'Vehicles', 'Sports', 'Toys & Games', 'Home & Garden',
      'Beauty & Health', 'Other'
    ])
    .withMessage('Please select a valid category'),
  
  body('condition')
    .isInt({ min: 1, max: 5 })
    .withMessage('Condition must be between 1 and 5'),
  
  body('yearsUsed')
    .isInt({ min: 0 })
    .withMessage('Years used must be a non-negative number'),
  
  body('damaged')
    .optional()
    .isBoolean()
    .withMessage('Damaged field must be a boolean'),
  
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('location.pincode')
    .trim()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  
  handleValidationErrors
];

const validateProductUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('condition')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Condition must be between 1 and 5'),
  
  handleValidationErrors
];

// Order validation rules
const validateOrderRequest = [
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  
  handleValidationErrors
];

const validateOrderUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID'),
  
  body('status')
    .isIn(['Accepted', 'Rejected', 'Completed', 'Cancelled'])
    .withMessage('Invalid status'),
  
  body('sellerMessage')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  
  handleValidationErrors
];

const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  
  handleValidationErrors
];

// Query validation rules
const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('category')
    .optional()
    .isIn([
      'Electronics', 'Furniture', 'Clothing', 'Books', 'Appliances',
      'Vehicles', 'Sports', 'Toys & Games', 'Home & Garden',
      'Beauty & Health', 'Other'
    ])
    .withMessage('Invalid category'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  query('minCondition')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Minimum condition must be between 1 and 5'),
  
  query('maxYearsUsed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum years used must be a non-negative number'),
  
  query('sortBy')
    .optional()
    .isIn(['price', 'createdAt', 'condition', 'views'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateOTP,
  validateProductCreation,
  validateProductUpdate,
  validateOrderRequest,
  validateOrderUpdate,
  validateRating,
  validateProductQuery,
  validateObjectId
};

