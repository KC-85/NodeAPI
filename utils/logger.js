const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const mongoose = require("mongoose");
const { sendErrorEmail } = require("../utils/emailAlert");
const { sendErrorSMS } = require("../utils/smsAlert");

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

const mongoURI = process.env.MONGO_URI;

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
    new transports.MongoDB({
      level: "info",
      db: mongoURI,
      collection: "logs",
      tryReconnect: true,
      options: { useUnifiedTopology: true },
    }),
  ],
});

// Detect Critical Errors & Send Alerts
logger.on("data", (log) => {
  if (log.level === "error") {
    sendErrorEmail(log.message);
    sendErrorSMS(log.message);
  }
});

mongoose.connection.once("open", () => {
  logger.info("Connected to MongoDB - Logging Initialized");
});

module.exports = logger;
