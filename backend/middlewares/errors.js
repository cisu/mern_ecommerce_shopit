const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Show the errors in development mode
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  // Show the errors in production mode
  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = {...err};

    error.message = err.message;

    // Wrong Mongoose Object ID Error
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose validation Error
    if (err.name === 'validationError') {
      const message = Object.values(err.errors).map(value => value.message);
      error = newErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
