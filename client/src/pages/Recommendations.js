import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import "../styles/Recommendations.css";

const Recommendations = () => {
  const [formData, setFormData] = useState({
    rank: "",
    category: "",
    state: "",
    budget: "",
    preferredBranches: [],
    preferenceWeight: 50,
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [aiExplanation, setAiExplanation] = useState("");
  const [explanationDialog, setExplanationDialog] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [summary, setSummary] = useState(null);

  const categories = ["general", "obc", "sc", "st"];
  const states = [
    "Delhi",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Telangana",
    "Andhra Pradesh",
  ];
  const branches = [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBranchToggle = (branch) => {
    setFormData((prev) => ({
      ...prev,
      preferredBranches: prev.preferredBranches.includes(branch)
        ? prev.preferredBranches.filter((b) => b !== branch)
        : [...prev.preferredBranches, branch],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendations([]);
    setSummary(null);
    try {
      const response = await axios.post("/api/colleges/recommend", formData);

      if (response.data.success) {
        // Extract all recommendations from the new ML engine response format
        const allRecs = response.data.allFlat || [];
        setRecommendations(allRecs);
        setSummary(response.data.summary);

        if (allRecs.length === 0) {
          setError(
            "No recommendations found for your criteria. Try adjusting your filters.",
          );
        }
      } else {
        setError(response.data.error || "Failed to get recommendations");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to get recommendations";
      setError(errorMsg);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeClass = (rec) => {
    const category = rec.admission?.category || rec.category;
    switch (category) {
      case "safe":
        return "badge badge-safe";
      case "target":
        return "badge badge-target";
      case "dream":
        return "badge badge-dream";
      default:
        return "badge";
    }
  };

  const getAIExplanation = async (college, branch, rank, category, cutoff) => {
    setExplanationLoading(true);
    setSelectedCollege({ college, branch });
    try {
      const response = await axios.post("/api/colleges/ai/explain", {
        college,
        branch,
        rank: parseInt(formData.rank),
        category: formData.category,
        cutoff,
      });
      setAiExplanation(response.data.explanation);
      setExplanationDialog(true);
    } catch (err) {
      setAiExplanation("Failed to get AI explanation. Please try again.");
      setExplanationDialog(true);
    } finally {
      setExplanationLoading(false);
    }
  };

  const collegeWeight = 100 - formData.preferenceWeight;
  const courseWeight = formData.preferenceWeight;

  return (
    <div className="rc-page">
      {/* Navbar */}
      <nav className="rc-nav">
        <div className="rc-nav-brand">
          <div className="rc-nav-logo">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1.5" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" />
            </svg>
          </div>
          <span className="rc-nav-title">College Advisor</span>
        </div>
        <div className="rc-nav-links">
          <a className="rc-nav-link" href="/">
            Home
          </a>
          <a className="rc-nav-link active" href="/recommendations">
            Recommendations
          </a>
          <a className="rc-nav-link" href="/chat">
            AI Chat
          </a>
          <a className="rc-nav-link" href="/profile">
            Profile
          </a>
        </div>
      </nav>

      <div className="rc-container">
        {/* Page Header */}
        <div className="rc-page-header">
          <div className="rc-page-tag">
            <span className="rc-tag-dot" />
            JEE Aspirants
          </div>
          <h1 className="rc-page-title">University &amp; Course Finder</h1>
          <p className="rc-page-sub">
            Set your preferences and we'll match you with the best options.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Weight Card */}
          <div className="rc-card">
            <div className="rc-section-label">Preference weight</div>
            <div className="rc-slider-labels">
              <span
                className={`rc-slider-lbl ${collegeWeight >= courseWeight ? "rc-lbl-active" : ""}`}
              >
                Better college
              </span>
              <span
                className={`rc-slider-lbl ${courseWeight > collegeWeight ? "rc-lbl-active" : ""}`}
              >
                Better course
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={formData.preferenceWeight}
              onChange={(e) =>
                handleInputChange("preferenceWeight", Number(e.target.value))
              }
              className="rc-slider"
            />
            <div className="rc-weight-grid">
              <div className="rc-weight-box">
                <div className="rc-weight-label">College weight</div>
                <div className="rc-weight-value">{collegeWeight}%</div>
              </div>
              <div className="rc-weight-box">
                <div className="rc-weight-label">Course weight</div>
                <div className="rc-weight-value">{courseWeight}%</div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="rc-card">
            <div className="rc-section-label">Your details</div>
            <div className="rc-form-grid">
              <div className="rc-form-group">
                <label className="rc-form-label">JEE rank *</label>
                <input
                  className="rc-input"
                  type="number"
                  placeholder="e.g. 4500"
                  value={formData.rank}
                  onChange={(e) => handleInputChange("rank", e.target.value)}
                  required
                  min="1"
                  max="1000000"
                />
              </div>
              <div className="rc-form-group">
                <label className="rc-form-label">Category *</label>
                <select
                  className="rc-input rc-select"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rc-form-group">
                <label className="rc-form-label">Location</label>
                <select
                  className="rc-input rc-select"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                >
                  <option value="">All locations</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rc-form-group">
                <label className="rc-form-label">Budget / year (₹)</label>
                <input
                  className="rc-input"
                  type="number"
                  placeholder="e.g. 200000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="rc-divider" />

            <div className="rc-section-label">Preferred branches</div>
            <div className="rc-branches-grid">
              {branches.map((branch) => (
                <button
                  type="button"
                  key={branch}
                  className={`rc-chip ${formData.preferredBranches.includes(branch) ? "rc-chip-selected" : ""}`}
                  onClick={() => handleBranchToggle(branch)}
                >
                  {formData.preferredBranches.includes(branch) && (
                    <svg
                      className="rc-chip-check"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                  {branch}
                </button>
              ))}
            </div>

            <div className="rc-submit-row">
              <span className="rc-submit-hint">
                {formData.preferredBranches.length > 0
                  ? `${formData.preferredBranches.length} branch${formData.preferredBranches.length > 1 ? "es" : ""} selected`
                  : "Select at least one branch"}
              </span>
              <button
                type="submit"
                className="rc-btn-primary"
                disabled={loading || !formData.rank || !formData.category}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={14}
                      sx={{ color: "inherit", mr: 1 }}
                    />
                    Finding matches...
                  </>
                ) : (
                  <>
                    Get recommendations <span className="rc-arrow">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="rc-error">
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="rc-error-icon"
            >
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 7.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
            {error}
          </div>
        )}

        {/* Results */}
        {recommendations.length > 0 && (
          <div className="rc-results">
            <div className="rc-results-header">
              <span className="rc-results-title">Recommendations</span>
              <span className="rc-results-count">
                {recommendations.length} matches found
              </span>
            </div>

            {summary && (
              <div className="rc-summary-card">
                <div className="rc-summary-stats">
                  <div className="rc-summary-stat">
                    <span className="rc-summary-label">Safe Options</span>
                    <span className="rc-summary-value">
                      {summary.byCategory?.safe || 0}
                    </span>
                  </div>
                  <div className="rc-summary-stat">
                    <span className="rc-summary-label">Target Options</span>
                    <span className="rc-summary-value">
                      {summary.byCategory?.target || 0}
                    </span>
                  </div>
                  <div className="rc-summary-stat">
                    <span className="rc-summary-label">Dream Options</span>
                    <span className="rc-summary-value">
                      {summary.byCategory?.dream || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {recommendations.map((rec, index) => (
              <div key={index} className="rc-result-card">
                <button
                  type="button"
                  className="rc-result-summary"
                  onClick={() =>
                    setExpandedCard(expandedCard === index ? null : index)
                  }
                >
                  <div className="rc-result-rank">{index + 1}</div>
                  <div className="rc-result-info">
                    <div className="rc-result-name">{rec.college}</div>
                    <div className="rc-result-branch">{rec.branch}</div>
                  </div>
                  <span className={getCategoryBadgeClass(rec)}>
                    {rec.admission?.category || rec.category}
                  </span>
                  <svg
                    className={`rc-chevron ${expandedCard === index ? "rc-chevron-open" : ""}`}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </button>

                {expandedCard === index && (
                  <div className="rc-result-details">
                    <div className="rc-details-grid">
                      <div className="rc-detail-item">
                        <span className="rc-detail-label">State</span>
                        <span className="rc-detail-value">{rec.state}</span>
                      </div>
                      <div className="rc-detail-item">
                        <span className="rc-detail-label">Type</span>
                        <span className="rc-detail-value">{rec.type}</span>
                      </div>
                      <div className="rc-detail-item">
                        <span className="rc-detail-label">NIRF Ranking</span>
                        <span className="rc-detail-value">
                          {rec.nirfRanking || "N/A"}
                        </span>
                      </div>
                      <div className="rc-detail-item">
                        <span className="rc-detail-label">Your cutoff</span>
                        <span className="rc-detail-value">{rec.cutoff}</span>
                      </div>
                      <div className="rc-detail-item">
                        <span className="rc-detail-label">Annual fees</span>
                        <span className="rc-detail-value">
                          ₹{rec.fees?.toLocaleString() || "N/A"}
                        </span>
                      </div>
                      <div className="rc-detail-item">
                        <span className="rc-detail-label">Avg package</span>
                        <span className="rc-detail-value">
                          ₹
                          {rec.placement?.averagePackage?.toLocaleString() ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="rc-detail-item">
                        <span className="rc-detail-label">Highest package</span>
                        <span className="rc-detail-value">
                          ₹
                          {rec.placement?.highestPackage?.toLocaleString() ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rc-btn-ai"
                      onClick={() =>
                        getAIExplanation(
                          rec.college,
                          rec.branch,
                          formData.rank,
                          formData.category,
                          rec.cutoff,
                        )
                      }
                      disabled={explanationLoading}
                    >
                      {explanationLoading ? (
                        <CircularProgress
                          size={13}
                          sx={{ color: "inherit", mr: 1 }}
                        />
                      ) : (
                        <svg
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="rc-ai-icon"
                        >
                          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM6.5 5.5a1.5 1.5 0 113 0c0 .83-.67 1.5-1.5 1.5v1a.5.5 0 01-1 0V6.5a.5.5 0 01.5-.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5a.5.5 0 01-1 0zM8 11a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                      )}
                      Get AI explanation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Explanation Dialog */}
      <Dialog
        open={explanationDialog}
        onClose={() => setExplanationDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: "rc-dialog" }}
      >
        <DialogTitle className="rc-dialog-title">
          <div className="rc-dialog-college">{selectedCollege?.college}</div>
          <div className="rc-dialog-branch">{selectedCollege?.branch}</div>
        </DialogTitle>
        <DialogContent className="rc-dialog-content">
          <p className="rc-dialog-text">{aiExplanation}</p>
        </DialogContent>
        <DialogActions className="rc-dialog-actions">
          <button
            className="rc-btn-primary"
            onClick={() => setExplanationDialog(false)}
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Recommendations;
