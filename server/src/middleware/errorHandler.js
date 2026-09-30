const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err);

  // PostgreSQL unique violation error (code 23505)
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A duplicate record already exists with these details.'
    });
  }

  // PostgreSQL invalid text representation / syntax
  if (err.code === '22P02') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource identifier format.'
    });
  }

  // Input validation error fallback
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join('. ')
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
