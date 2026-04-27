/**
 * ============================================================================
 * MIDDLEWARE - Validation, Auth, Rate Limiting
 * ============================================================================
 */

const jwt = require("jsonwebtoken");

// ============================================================================
// REQUEST VALIDATION MIDDLEWARE
// ============================================================================

const validationSchemas = {
  getRecommendations: {
    rank: {
      required: true,
      type: "number",
      min: 1,
      max: 500000,
      message: "Rank must be between 1 and 500,000",
    },
    category: {
      required: true,
      type: "string",
      enum: ["GENERAL", "OBC", "SC", "ST", "EWS"],
      message: "Category must be GENERAL, OBC, SC, ST, or EWS",
    },
    budget: {
      required: false,
      type: "number",
      min: 50000,
      max: 5000000,
      message: "Budget must be between ₹50,000 and ₹50,00,000",
    },
    preferredBranches: {
      required: false,
      type: "array",
      message: "Preferred branches must be an array",
    },
    preferenceWeight: {
      required: false,
      type: "number",
      min: 0,
      max: 100,
      default: 50,
      message: "Preference weight must be between 0 and 100",
    },
    state: {
      required: false,
      type: "string",
    },
    maxResults: {
      required: false,
      type: "number",
      min: 10,
      max: 100,
      default: 50,
    },
  },

  compareColleges: {
    collegeIds: {
      required: true,
      type: "array",
      minLength: 2,
      maxLength: 5,
      message: "Please provide 2-5 college IDs to compare",
    },
  },
};

exports.validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = validationSchemas[schemaName];

    if (!schema) {
      return next();
    }

    const errors = [];
    const data = req.body;

    // Validate each field
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      // Check required
      if (
        rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip validation if field is optional and not provided
      if (!rules.required && (value === undefined || value === null)) {
        // Set default if provided
        if (rules.default !== undefined) {
          data[field] = rules.default;
        }
        continue;
      }

      // Type validation
      if (rules.type === "number" && isNaN(Number(value))) {
        errors.push(`${field} must be a number`);
        continue;
      }

      if (rules.type === "array" && !Array.isArray(value)) {
        errors.push(`${field} must be an array`);
        continue;
      }

      // Range validation
      if (rules.type === "number") {
        const numValue = Number(value);

        if (rules.min !== undefined && numValue < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }

        if (rules.max !== undefined && numValue > rules.max) {
          errors.push(`${field} must be at most ${rules.max}`);
        }
      }

      // Array length validation
      if (rules.type === "array") {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must have at least ${rules.minLength} items`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must have at most ${rules.maxLength} items`);
        }
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(
          rules.message || `${field} must be one of: ${rules.enum.join(", ")}`,
        );
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors,
      });
    }

    next();
  };
};

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

exports.authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please provide a valid token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    req.user = decoded;

    // Verify userId in params matches token
    if (req.params.userId && req.params.userId !== decoded.userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You can only access your own data",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
      message: error.message,
    });
  }
};

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

const requestCounts = new Map();

exports.rateLimiter = ({ maxRequests = 20, windowMs = 60000 } = {}) => {
  return (req, res, next) => {
    const identifier = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();

    // Get or create request log for this identifier
    if (!requestCounts.has(identifier)) {
      requestCounts.set(identifier, []);
    }

    const requests = requestCounts.get(identifier);

    // Remove old requests outside the time window
    const recentRequests = requests.filter((time) => now - time < windowMs);

    // Check if limit exceeded
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: "Too many requests",
        message: `Please wait before making more requests. Limit: ${maxRequests} per ${windowMs / 1000} seconds`,
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
      });
    }

    // Add current request
    recentRequests.push(now);
    requestCounts.set(identifier, recentRequests);

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      // 1% chance on each request
      this.cleanupRateLimiter();
    }

    next();
  };
};

exports.cleanupRateLimiter = () => {
  const now = Date.now();
  const windowMs = 60000; // 1 minute

  for (const [identifier, requests] of requestCounts.entries()) {
    const recentRequests = requests.filter((time) => now - time < windowMs);

    if (recentRequests.length === 0) {
      requestCounts.delete(identifier);
    } else {
      requestCounts.set(identifier, recentRequests);
    }
  }
};

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

exports.errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// ============================================================================
// LOGGING MIDDLEWARE
// ============================================================================

exports.requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log after response is sent
  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  });

  next();
};

// ============================================================================
// CORS MIDDLEWARE
// ============================================================================

exports.corsConfig = (req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};
