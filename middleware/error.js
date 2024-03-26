const errorMiddleware = (err, req, res, next) => {
  // Handle the error here
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

module.exports = errorMiddleware;
