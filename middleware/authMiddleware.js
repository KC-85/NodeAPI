const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const req = require("express/lib/request");
const res = require("express/lib/response");

// Generate a unique JWT token for every use, every time
const generateToken = () => {
    // 64-character random string
    const randomString = crypto.randomBytes(32).toString("hex");
    return jwt.sign({ token: randomString }, process.env.JWT_SECRET, { expiresIn: "30d"});
};

// Middleware to verify JWT token
const protect = async (req, res, next) => {
    let token = req.headers.authorisation;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        //Extract token after "Bearer "
        token = token.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware for Role-Based Access Control (RBAC)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access Denied" });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles, generateToken };