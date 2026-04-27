const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const collegeRoutes = require("./routes/collegeRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Verify required environment variables
if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI not defined in .env file");
  process.exit(1);
}

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Rate limiting (more lenient for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  skip: (req, res) => process.env.NODE_ENV !== "production",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/colleges", collegeRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO_URI:", MONGO_URI);

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✓ MongoDB Connected Successfully");

    // Check if collections exist and have data
    const collegeCount = await mongoose.connection
      .collection("colleges")
      .countDocuments();
    console.log(`✓ Found ${collegeCount} colleges in database`);

    if (collegeCount === 0) {
      console.log("⚠ No colleges found. Run: npm run seed");
    }

    app.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API health check: http://localhost:${PORT}/api/health`);
      console.log(`✓ Frontend: http://localhost:3000`);
    });
  } catch (err) {
    console.error("✗ MongoDB connection error:", err.message);
    console.log("\nTroubleshooting steps:");
    console.log("1. Ensure MongoDB is running locally");
    console.log("2. Or update MONGO_URI in .env to use MongoDB Atlas");
    console.log("3. Run 'npm run seed' after connecting database");
    console.log("\nRetrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

// Handle MongoDB disconnection
mongoose.connection.on("disconnected", () => {
  console.log("✗ MongoDB disconnected. Attempting reconnect...");
});

connectDB();
