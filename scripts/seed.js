const mongoose = require("mongoose");
const College = require("../models/College");
const collegesData = require("../data/colleges.json");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await College.deleteMany({});
    console.log("Cleared existing colleges");

    // Insert new data
    await College.insertMany(collegesData);
    console.log(`Seeded ${collegesData.length} colleges`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

seedDatabase();
