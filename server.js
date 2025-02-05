require("./config/dotenv.config");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("./middleware/rateLimit");
const { errorHandler } = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const logger = require("./utils/logger");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit);

// Routes
app.use("/api/users", userRoutes);

// Simulated Critical Error for Testing
app.get("/test-error", (req, res, next) => {
  const errorMessage = "Simulated Critical Error: Database Connection Failed";
  logger.error(errorMessage); // Log it with Winston
  next(new Error(errorMessage)); // Pass it to error handler
});

// Error Handling Middleware (Must Be Placed After Routes)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => logger.info(`🚀 Server running on port ${PORT}`));
