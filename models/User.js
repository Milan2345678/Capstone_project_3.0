const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema({
  rank: Number,
  category: String,
  state: String,
  budget: Number,
  preferredBranches: [String],
  results: [
    {
      college: String,
      branch: String,
      category: String, // dream, target, safe
      cutoff: Number,
    },
  ],
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    rank: Number,
    category: String,
    state: String,
    budget: Number,
    preferredBranches: [String],
    searchHistory: [searchHistorySchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
