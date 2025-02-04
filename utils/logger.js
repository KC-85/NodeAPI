const { createLogger, format, transports } = require("winston");

// Define custom log format
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

// Create Winston logger instance
const logger = createLogger({
  level: "info", // Default logging level
  format: logFormat,
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to a file
    new transports.File({ filename: "logs/combined.log" }), // Log all levels to a file
  ],
});

module.exports = logger;
