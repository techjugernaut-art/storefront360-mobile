const { AppError } = require('./errorHandler');

/**
 * Joi validation middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return next(new AppError(
        `Validation error: ${errors.map(e => e.message).join(', ')}`,
        400
      ));
    }

    // Replace req.body with validated value
    req.body = value;
    next();
  };
};

module.exports = validate;
