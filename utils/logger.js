const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const mongoose = require("mongoose");
const { sendErrorEmail } = require("../utils/emailAlert"); // Keep Email Alerts

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

logger.on("data", (log) => {
  console.log(`🔍 LOG EVENT DETECTED: Level=${log.level}, Message=${log.message}`); // Debugging log
  if (log.level === "error") {
    console.log("🚨 Sending Email Alert...");
    sendErrorEmail(log.message);
  }
});

mongoose.connection.once("open", () => {
  logger.info("Connected to MongoDB - Logging Initialized");
});

module.exports = logger;
