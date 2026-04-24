const College = require("../models/college");
const User = require("../models/User");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Categorize colleges based on rank and cutoff
const categorizeCollege = (rank, cutoff) => {
  if (!cutoff) return "unknown";

  const ratio = rank / cutoff;

  if (ratio < 0.8) return "safe"; // rank is much lower than cutoff
  if (ratio <= 1.2) return "target"; // rank is close to cutoff
  return "dream"; // rank is higher than cutoff (less competitive)
};

// Get all colleges
exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get recommendations with categorization
exports.getRecommendations = async (req, res) => {
  try {
    const { rank, category, state, budget, preferredBranches, userId } =
      req.body;

    if (!rank || !category) {
      return res.status(400).json({ error: "Rank and category are required" });
    }

    const query = {};
    if (state) query.state = state;

    const colleges = await College.find(query);
    let results = [];

    colleges.forEach((college) => {
      college.branches.forEach((branch) => {
        // Check if branch is preferred (if preferences specified)
        if (preferredBranches && preferredBranches.length > 0) {
          if (!preferredBranches.includes(branch.name)) return;
        }

        const cutoff = branch.cutoff[category.toLowerCase()];

        if (cutoff && rank <= cutoff * 1.5) {
          // Include colleges within 50% above cutoff
          const collegeCategory = categorizeCollege(rank, cutoff);

          results.push({
            college: college.name,
            state: college.state,
            type: college.type,
            nirfRanking: college.nirfRanking,
            branch: branch.name,
            cutoff: cutoff,
            category: collegeCategory,
            fees: college.fees,
            placement: college.placement,
          });
        }
      });
    });

    // Sort results: preferred branches first, then by category priority, then by NIRF ranking
    results.sort((a, b) => {
      // Category priority: safe > target > dream
      const categoryOrder = { safe: 3, target: 2, dream: 1 };
      if (categoryOrder[a.category] !== categoryOrder[b.category]) {
        return categoryOrder[b.category] - categoryOrder[a.category];
      }

      // Then by NIRF ranking (lower number is better)
      if (a.nirfRanking && b.nirfRanking) {
        return a.nirfRanking - b.nirfRanking;
      }

      return 0;
    });

    // Save search history if user is logged in
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          searchHistory: {
            rank,
            category,
            state,
            budget,
            preferredBranches,
            results: results.slice(0, 10), // Save top 10 results
          },
        },
      });
    }

    res.json({
      totalResults: results.length,
      recommendations: results.slice(0, 50), // Limit to top 50 results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get AI explanation for a recommendation
exports.getAIExplanation = async (req, res) => {
  try {
    const { college, branch, rank, category, cutoff, recommendationCategory } =
      req.body;

    const prompt = `
        You are an AI college counselor for JEE aspirants. Explain why "${college}" with "${branch}" branch is categorized as "${recommendationCategory}" for a student with:
        - JEE Rank: ${rank}
        - Category: ${category}
        - Branch Cutoff: ${cutoff}

        Provide a helpful, encouraging explanation in 2-3 sentences that includes:
        1. The chance of admission
        2. Why this categorization
        3. Any advice for the student

        Keep it concise and student-friendly.
        `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const explanation = completion.choices[0].message.content;

    res.json({ explanation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Service Error" });
  }
};

// Chat with AI assistant
exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    const systemPrompt = `You are an AI college counselor specializing in JEE counseling and college admissions.
        Help students with questions about:
        - College choices and branch preferences
        - Admission chances based on rank and category
        - Counseling strategies (JoSAA, state counseling)
        - College comparisons
        - Career advice related to engineering branches

        Be helpful, accurate, and encouraging. If you don't know something specific, say so.
        Keep responses concise but informative.

        Context: ${context || "General JEE counseling discussion"}
        `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    });

    const response = completion.choices[0].message.content;

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Chat Service Error" });
  }
};
