/**
 * ============================================================================
 * COMPLETE COLLEGE RECOMMENDATION ENGINE - PURE NODE.JS
 * ============================================================================
 *
 * No Python dependencies - All ML algorithms implemented in JavaScript
 * Features: Content-Based Filtering, Dynamic Scoring, Preference Weighting
 * ============================================================================
 */

const College = require("../models/college");
const User = require("../models/User");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BRANCH_PRESTIGE = {
  "Computer Science and Engineering": 100,
  "Information Technology": 95,
  "Electronics and Communication Engineering": 90,
  "Electrical Engineering": 85,
  "Mechanical Engineering": 70,
  "Civil Engineering": 60,
  "Chemical Engineering": 65,
  Biotechnology: 55,
  default: 50,
};

const COLLEGE_TYPE_BASE = {
  IIT: 100,
  NIT: 85,
  IIIT: 75,
  Government: 65,
  Private: 45,
  default: 40,
};

class RecommendationEngine {
  static async getRecommendations(req, res) {
    const startTime = Date.now();

    try {
      const {
        rank,
        category,
        state,
        budget,
        preferredBranches = [],
        preferenceWeight = 50,
        userId,
        maxResults = 50,
      } = req.body;

      if (!rank || !category) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
          required: ["rank", "category"],
        });
      }

      const rankNum = parseInt(rank);
      if (rankNum < 1 || rankNum > 500000) {
        return res.status(400).json({
          success: false,
          error: "Rank must be between 1 and 500,000",
        });
      }

      const weight = Math.max(
        0,
        Math.min(100, parseInt(preferenceWeight) || 50),
      );
      const courseWeight = weight / 100;
      const collegeWeight = 1 - courseWeight;

      console.log(
        `[Recommendation] Rank: ${rankNum}, Category: ${category}, Weight: ${weight}%`,
      );

      const query = {};
      if (state && state !== "All locations") {
        query.state = state;
      }

      const colleges = await College.find(query).lean();

      if (!colleges || colleges.length === 0) {
        return res.json({
          success: true,
          totalResults: 0,
          recommendations: { safe: [], target: [], dream: [] },
          message: "No colleges found for your filters",
        });
      }

      console.log(`[Recommendation] Analyzing ${colleges.length} colleges`);

      const results = [];
      const seen = new Set();

      for (const college of colleges) {
        if (budget && college.fees > budget) continue;

        const branches = college.branches || [];

        for (const branch of branches) {
          if (
            preferredBranches.length > 0 &&
            !preferredBranches.includes(branch.name)
          ) {
            continue;
          }

          const cutoff = branch.cutoff?.[category.toLowerCase()];
          if (!cutoff) continue;

          const admissionProb = this.calculateAdmissionProbability(
            rankNum,
            cutoff,
          );
          if (admissionProb < 0.3) continue;

          const categoryTag = this.getCategoryTag(admissionProb);

          const branchScore = this.getBranchPrestigeScore(branch.name);
          const collegeScore = this.getCollegePrestigeScore(
            college.type,
            college.nirfRanking,
          );
          const placementScore = this.getPlacementScore(college.placement);
          const probabilityScore = Math.min(admissionProb * 100, 100);

          const similarity = this.calculateSimilarity(
            { rank: rankNum, budget, preferredBranches, category },
            { college, branch },
          );

          const finalScore = this.calculateFinalScore({
            branchScore,
            collegeScore,
            placementScore,
            probabilityScore,
            similarity,
            courseWeight,
            collegeWeight,
          });

          const dedupeKey = `${college._id}-${branch.name}`;
          if (seen.has(dedupeKey)) continue;
          seen.add(dedupeKey);

          results.push({
            collegeId: college._id,
            college: college.name,
            branch: branch.name,
            state: college.state,
            type: college.type,
            nirfRanking: college.nirfRanking,
            fees: college.fees,
            placement: college.placement,
            cutoff,
            admission: {
              probability: (admissionProb * 100).toFixed(1) + "%",
              probabilityRaw: admissionProb,
              category: categoryTag,
              message: this.getAdmissionMessage(categoryTag, admissionProb),
            },
            scores: {
              branch: branchScore.toFixed(1),
              college: collegeScore.toFixed(1),
              placement: placementScore.toFixed(1),
              probability: probabilityScore.toFixed(1),
              similarity: (similarity * 100).toFixed(1),
              final: finalScore.toFixed(2),
            },
            metrics: {
              studentFit: (similarity * 100).toFixed(1) + "%",
              overallRank: 0,
            },
          });
        }
      }

      console.log(
        `[Recommendation] Generated ${results.length} recommendations`,
      );

      const sortedResults = this.sortRecommendations(results);
      sortedResults.forEach((result, index) => {
        result.metrics.overallRank = index + 1;
      });

      const categorized = this.categorizeResults(sortedResults);

      if (userId) {
        this.saveSearchHistory(userId, {
          rank: rankNum,
          category,
          state,
          budget,
          preferredBranches,
          preferenceWeight: weight,
          totalResults: results.length,
        }).catch((err) => console.error("Failed to save history:", err));
      }

      const responseTime = Date.now() - startTime;

      return res.json({
        success: true,
        summary: {
          totalResults: results.length,
          responseTime: `${responseTime}ms`,
          byCategory: {
            safe: categorized.safe.length,
            target: categorized.target.length,
            dream: categorized.dream.length,
          },
          studentProfile: {
            rank: rankNum,
            category,
            preferenceWeight: weight,
            courseVsCollege: `${(courseWeight * 100).toFixed(0)}% Course / ${(collegeWeight * 100).toFixed(0)}% College`,
          },
        },
        recommendations: {
          safe: categorized.safe.slice(0, Math.ceil(maxResults * 0.3)),
          target: categorized.target.slice(0, Math.ceil(maxResults * 0.5)),
          dream: categorized.dream.slice(0, Math.ceil(maxResults * 0.2)),
        },
        allFlat: sortedResults.slice(0, maxResults),
      });
    } catch (error) {
      console.error("[Recommendation Error]:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to generate recommendations",
        message: error.message,
      });
    }
  }

  static getBranchPrestigeScore(branchName) {
    return BRANCH_PRESTIGE[branchName] || BRANCH_PRESTIGE.default;
  }

  static getCollegePrestigeScore(type, nirfRanking) {
    const baseScore = COLLEGE_TYPE_BASE[type] || COLLEGE_TYPE_BASE.default;
    let nirfBoost = 0;
    if (nirfRanking && !isNaN(nirfRanking)) {
      nirfBoost = Math.max(0, 30 - nirfRanking / 5);
    }
    return Math.min(baseScore + nirfBoost, 100);
  }

  static getPlacementScore(placement) {
    if (!placement) return 0;

    const avgPackage = placement.averagePackage || 0;
    const highestPackage = placement.highestPackage || avgPackage;

    const packageScore = Math.min((avgPackage / 2000000) * 100, 100);
    const highestScore = Math.min((highestPackage / 3000000) * 100, 100);

    return packageScore * 0.6 + highestScore * 0.4;
  }

  static calculateAdmissionProbability(rank, cutoff) {
    const rawProb = cutoff / rank;

    if (rawProb >= 1.5) return 0.99;
    if (rawProb >= 1.1) return 0.85;
    if (rawProb >= 0.9) return 0.7;
    if (rawProb >= 0.6) return 0.5;
    if (rawProb >= 0.4) return 0.3;
    return rawProb * 0.5;
  }

  static getCategoryTag(probability) {
    if (probability >= 0.75) return "safe";
    if (probability >= 0.45) return "target";
    return "dream";
  }

  static getAdmissionMessage(category, probability) {
    const percent = (probability * 100).toFixed(0);

    if (category === "safe") {
      return `Excellent chance of admission (${percent}%)`;
    } else if (category === "target") {
      return `Good chance of admission (${percent}%)`;
    } else {
      return `Challenging but possible (${percent}%)`;
    }
  }

  static calculateSimilarity(studentProfile, collegeData) {
    const { rank, budget, preferredBranches, category } = studentProfile;
    const { college, branch } = collegeData;

    let similarityScore = 0;
    let totalWeight = 0;

    if (preferredBranches.includes(branch.name)) {
      similarityScore += 0.4;
    } else {
      const branchFamily = this.getBranchFamily(branch.name);
      const hasRelatedBranch = preferredBranches.some(
        (b) => this.getBranchFamily(b) === branchFamily,
      );
      if (hasRelatedBranch) similarityScore += 0.2;
    }
    totalWeight += 0.4;

    if (budget) {
      const budgetFit = 1 - Math.abs(college.fees - budget) / budget;
      similarityScore += Math.max(0, budgetFit) * 0.25;
    } else {
      similarityScore += 0.25;
    }
    totalWeight += 0.25;

    const collegeScore = this.getCollegePrestigeScore(
      college.type,
      college.nirfRanking,
    );
    const rankScore = Math.max(0, 100 - rank / 5000);
    const prestigeFit = 1 - Math.abs(collegeScore - rankScore) / 100;
    similarityScore += prestigeFit * 0.2;
    totalWeight += 0.2;

    const expectedPlacement = this.getExpectedPlacementForRank(rank);
    const actualPlacement = this.getPlacementScore(college.placement);
    const placementFit =
      1 - Math.abs(expectedPlacement - actualPlacement) / 100;
    similarityScore += Math.max(0, placementFit) * 0.15;
    totalWeight += 0.15;

    return similarityScore / totalWeight;
  }

  static getBranchFamily(branchName) {
    if (
      branchName.includes("Computer") ||
      branchName.includes("Information Technology") ||
      branchName.includes("AI")
    ) {
      return "CS";
    }
    if (
      branchName.includes("Electronics") ||
      branchName.includes("Communication")
    ) {
      return "ECE";
    }
    if (branchName.includes("Electrical")) {
      return "EE";
    }
    if (
      branchName.includes("Mechanical") ||
      branchName.includes("Automobile")
    ) {
      return "ME";
    }
    if (branchName.includes("Civil")) {
      return "CE";
    }
    if (branchName.includes("Chemical")) {
      return "ChE";
    }
    return "Other";
  }

  static getExpectedPlacementForRank(rank) {
    if (rank < 1000) return 90;
    if (rank < 5000) return 80;
    if (rank < 10000) return 70;
    if (rank < 25000) return 60;
    if (rank < 50000) return 50;
    return 40;
  }

  static calculateFinalScore({
    branchScore,
    collegeScore,
    placementScore,
    probabilityScore,
    similarity,
    courseWeight,
    collegeWeight,
  }) {
    return (
      branchScore * courseWeight * 0.35 +
      collegeScore * collegeWeight * 0.3 +
      placementScore * 0.2 +
      probabilityScore * 0.1 +
      similarity * 100 * 0.05
    );
  }

  static sortRecommendations(results) {
    const categoryOrder = { safe: 3, target: 2, dream: 1 };

    return results.sort((a, b) => {
      const catDiff =
        categoryOrder[b.admission.category] -
        categoryOrder[a.admission.category];
      if (catDiff !== 0) return catDiff;

      return parseFloat(b.scores.final) - parseFloat(a.scores.final);
    });
  }

  static categorizeResults(sortedResults) {
    return {
      safe: sortedResults.filter((r) => r.admission.category === "safe"),
      target: sortedResults.filter((r) => r.admission.category === "target"),
      dream: sortedResults.filter((r) => r.admission.category === "dream"),
    };
  }

  static async saveSearchHistory(userId, searchData) {
    try {
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            searchHistory: {
              ...searchData,
              timestamp: new Date(),
            },
          },
        },
        { new: true },
      );
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  }
}

exports.getRecommendations = (req, res) =>
  RecommendationEngine.getRecommendations(req, res);

exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find().lean();
    return res.json({
      success: true,
      colleges,
      total: colleges.length,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch colleges",
    });
  }
};

exports.getAIExplanation = async (req, res) => {
  try {
    const { college, branch, rank, category, cutoff } = req.body;

    const prompt = `
Explain why ${college} - ${branch} is a good option for:
Rank: ${rank}, Category: ${category}, Cutoff: ${cutoff}

Give: 1. Admission chance, 2. Reason, 3. Advice
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    res.json({
      success: true,
      explanation: completion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "AI failed" });
  }
};

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a JEE college counselor. Give smart and short advice.",
        },
        { role: "user", content: message },
      ],
    });

    res.json({
      success: true,
      response: completion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Chat failed" });
  }
};
