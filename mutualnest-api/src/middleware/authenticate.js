const { verifyToken } = require('../utils/jwt');
const { AppError } = require('./errorHandler');
const { User } = require('../models');

/**
 * Authenticate middleware - Verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided', 401));
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new AppError('Invalid or expired token', 401));
    }

    // Get user from database
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Account is inactive', 401));
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role || 'customer';

    next();
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};

/**
 * Authorize middleware - Check user role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.userRole)) {
      return next(new AppError('Not authorized to access this resource', 403));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
