const mongoose = require("mongoose");

const cutoffHistorySchema = new mongoose.Schema({
  year: Number,
  round: Number,
  general: Number,
  obc: Number,
  sc: Number,
  st: Number,
});

const branchSchema = new mongoose.Schema({
  name: String,
  cutoff: {
    general: Number,
    obc: Number,
    sc: Number,
    st: Number,
  },
  cutoffHistory: [cutoffHistorySchema],
  seats: {
    general: Number,
    obc: Number,
    sc: Number,
    st: Number,
  },
});

const collegeSchema = new mongoose.Schema(
  {
    name: String,
    state: String,
    type: String, // NIT, IIIT, IIT, etc.
    nirfRanking: Number,
    fees: Number,
    placement: {
      averagePackage: Number,
      highestPackage: Number,
    },
    branches: [branchSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("College", collegeSchema);
