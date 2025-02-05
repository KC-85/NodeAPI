const logger = require("../utils/logger"); // Import Winston logger

const errorHandler = (err, req, res, next) => {
  console.error(`🚨 API Error: ${err.message}`);

  // Log error in Winston (Triggers Email Alert)
  logger.error(err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
