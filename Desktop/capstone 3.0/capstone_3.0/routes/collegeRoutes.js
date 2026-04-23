const express = require("express");
const router = express.Router();
const {
  getColleges,
  getRecommendations,
  getAIExplanation,
  chatWithAI,
} = require("../controllers/collegeController");

router.get("/", getColleges);
router.post("/recommend", getRecommendations);
router.post("/ai/explain", getAIExplanation);
router.post("/chat", chatWithAI);

module.exports = router;
