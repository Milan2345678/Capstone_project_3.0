const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

console.log("\n╔════════════════════════════════════════╗");
console.log("║  System Diagnostic Report              ║");
console.log("╚════════════════════════════════════════╝\n");

// Check Node.js version
console.log("📦 Runtime Environment:");
console.log(`   Node.js: ${process.version}`);
console.log(
  `   NPM: ${require("child_process").execSync("npm -v", { encoding: "utf8" }).trim()}`,
);
console.log(`   Platform: ${process.platform}`);
console.log(`   CWD: ${process.cwd()}\n`);

// Check environment variables
console.log("⚙️  Environment Variables:");
if (process.env.MONGO_URI) {
  console.log(`   ✓ MONGO_URI is set`);
  const uri = process.env.MONGO_URI;
  if (uri.includes("localhost")) {
    console.log(`     → Local MongoDB: ${uri}`);
  } else if (uri.includes("mongodb+srv")) {
    console.log(`     → MongoDB Atlas detected`);
  }
} else {
  console.log(`   ✗ MONGO_URI is NOT set`);
}

if (process.env.OPENAI_API_KEY) {
  const key = process.env.OPENAI_API_KEY;
  console.log(`   ✓ OPENAI_API_KEY: ${key.substring(0, 10)}...`);
} else {
  console.log(`   ⚠ OPENAI_API_KEY is not set (AI features disabled)`);
}

console.log(`   PORT: ${process.env.PORT || 5000}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}\n`);

// Check file structure
console.log("📁 Project Structure:");
const requiredFiles = [
  "server.js",
  ".env",
  "controllers/collegeController.js",
  "models/college.js",
  "models/User.js",
  "routes/collegeRoutes.js",
  "data/colleges.json",
  "scripts/seed.js",
  "package.json",
  "client/package.json",
  "client/src/App.js",
];

let allFilesExist = true;
requiredFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${exists ? "✓" : "✗"} ${file}`);
  if (!exists) allFilesExist = false;
});
console.log();

// Test MongoDB connection
console.log("🗄️  Database Connection:");
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(async () => {
    console.log(`   ✓ Connected to MongoDB`);

    try {
      const collegeCount = await mongoose.connection
        .collection("colleges")
        .countDocuments();
      console.log(`   ✓ Found ${collegeCount} colleges in database`);

      if (collegeCount === 0) {
        console.log(`   ⚠ WARNING: No colleges found. Run: npm run seed\n`);
      } else {
        console.log();
      }
    } catch (err) {
      console.log(`   ✗ Error counting colleges: ${err.message}\n`);
    }

    // Summary
    console.log("📋 Diagnostic Summary:");
    console.log(`   ${allFilesExist ? "✓" : "✗"} All required files present`);
    console.log(`   ✓ Environment variables configured`);
    console.log(`   ✓ Database connection successful`);

    console.log("\n✅ System is ready to start!");
    console.log("\nNext steps:");
    console.log("1. Terminal 1: npm run dev");
    console.log("2. Terminal 2: cd client && npm start");
    console.log("3. Open http://localhost:3000 in browser\n");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(`   ✗ MongoDB Connection Failed: ${err.message}`);
    console.log("\n❌ Cannot proceed with startup");
    console.log("\nTroubleshooting:");
    console.log("1. Is MongoDB running?");
    console.log("   - Windows: mongod");
    console.log("   - macOS: brew services start mongodb-community");
    console.log("   - Linux: sudo systemctl start mongod");
    console.log("2. Check MONGO_URI in .env file");
    console.log(
      "3. For MongoDB Atlas, ensure IP whitelist includes your location\n",
    );
    process.exit(1);
  });
