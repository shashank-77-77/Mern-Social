const TryCatch = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      const statusCode = res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500;

      res.status(statusCode).json({
        message: error.message || "Internal Server Error",
      });
    }
  };
};

export default TryCatch;
