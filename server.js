require("./config/dotenv.config"); // Load environment variables
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("./middleware/rateLimit");
const { errorHandler } = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Request logging
app.use(rateLimit); // Rate limiter

// Routes
app.use("/api/users", userRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
