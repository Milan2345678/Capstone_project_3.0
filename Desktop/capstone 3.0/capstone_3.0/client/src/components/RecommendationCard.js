import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import "../styles/RecommendationCard.css";

/**
 * RECOMMENDATION CARD COMPONENT
 *
 * Displays individual college-branch recommendation with:
 * - Institution metrics (NIRF ranking, fees, placement)
 * - Admission probability and category (Safe/Target/Dream)
 * - AI Explanation modal with fallback support
 * - Detailed score breakdowns
 */
const RecommendationCard = ({ recommendation, categoryColor }) => {
  const [openModal, setOpenModal] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [explanationSource, setExplanationSource] = useState("");

  const {
    college,
    branch,
    type,
    nirfRanking,
    fees,
    placement,
    cutoff,
    admission,
    scores,
    metrics,
    state,
  } = recommendation;

  const handleGetExplanation = async () => {
    setOpenModal(true);
    setLoading(true);

    try {
      const response = await axios.post("/api/colleges/ai-explanation", {
        college,
        branch,
        rank: admission.probabilityRaw, // Will be normalized in backend
        category: "General", // Should come from context
        cutoff,
      });

      setExplanation(response.data.explanation);
      setExplanationSource(response.data.source || "unknown");
    } catch (error) {
      console.error("Error fetching explanation:", error);
      setExplanation(
        `Unable to generate detailed explanation at this moment. Based on your profile: Your rank vs the cutoff of ${cutoff} suggests this is a ${admission.category.toUpperCase()} option. Consult official JoSAA portal for real-time counseling.`,
      );
      setExplanationSource("error_fallback");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setExplanation(null);
  };

  const getCategoryBgColor = () => {
    switch (admission.category) {
      case "safe":
        return "#d4edda";
      case "target":
        return "#fff3cd";
      case "dream":
        return "#f8d7da";
      default:
        return "#e2e3e5";
    }
  };

  const getCategoryTextColor = () => {
    switch (admission.category) {
      case "safe":
        return "#155724";
      case "target":
        return "#856404";
      case "dream":
        return "#721c24";
      default:
        return "#383d41";
    }
  };

  const getCategoryIcon = () => {
    switch (admission.category) {
      case "safe":
        return "✅";
      case "target":
        return "🎯";
      case "dream":
        return "💭";
      default:
        return "📍";
    }
  };

  return (
    <>
      <Card className="recommendation-card" sx={{ height: "100%" }}>
        <CardContent sx={{ pb: 1 }}>
          {/* Header: College Name & Type Badge */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {college}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {branch}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 0.5,
              }}
            >
              <Chip
                label={type}
                size="small"
                variant="outlined"
                icon={<SchoolIcon />}
              />
              {nirfRanking && (
                <Typography variant="caption" color="textSecondary">
                  NIRF: #{nirfRanking}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Category & Admission Probability */}
          <Box
            sx={{
              backgroundColor: getCategoryBgColor(),
              padding: 1.5,
              borderRadius: 1,
              marginBottom: 2,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography sx={{ fontSize: "1.2rem" }}>
                {getCategoryIcon()}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: getCategoryTextColor(),
                  textTransform: "uppercase",
                }}
              >
                {admission.category} OPTION
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: getCategoryTextColor() }}>
              {admission.probability} probability · {admission.message}
            </Typography>
          </Box>

          {/* Key Metrics Grid */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* NIRF Ranking */}
            {nirfRanking && (
              <Grid item xs={6}>
                <Box className="metric-box">
                  <Typography variant="caption" color="textSecondary">
                    NIRF Ranking
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    #{nirfRanking}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Annual Fees */}
            <Grid item xs={6}>
              <Box className="metric-box">
                <Typography variant="caption" color="textSecondary">
                  Annual Fees
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold" }}
                  title={`₹${fees}`}
                >
                  {fees > 1000000
                    ? `₹${(fees / 100000).toFixed(1)}L`
                    : `₹${(fees / 1000).toFixed(0)}K`}
                </Typography>
              </Box>
            </Grid>

            {/* Average Placement */}
            {placement && placement.averagePackage && (
              <Grid item xs={6}>
                <Box className="metric-box">
                  <Typography variant="caption" color="textSecondary">
                    Avg. Package
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold" }}
                    title={`₹${placement.averagePackage}`}
                  >
                    {placement.averagePackage > 1000000
                      ? `₹${(placement.averagePackage / 100000).toFixed(1)}L`
                      : `₹${(placement.averagePackage / 1000).toFixed(0)}K`}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Placement Score */}
            <Grid item xs={6}>
              <Box className="metric-box">
                <Typography variant="caption" color="textSecondary">
                  Placement Score
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1976d2" }}
                >
                  {scores.placement}
                </Typography>
              </Box>
            </Grid>

            {/* Location */}
            {state && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: "1rem" }} />
                  <Typography variant="caption" color="textSecondary">
                    {state}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Detailed Scores */}
          <Box sx={{ backgroundColor: "#f9f9f9", p: 1.5, borderRadius: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", display: "block", mb: 1 }}
            >
              Score Breakdown
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="caption">
                  Branch: <strong>{scores.branch}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">
                  College: <strong>{scores.college}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">
                  Placement: <strong>{scores.placement}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">
                  Probability: <strong>{scores.probability}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  Student Fit: <strong>{metrics.studentFit}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  Overall Rank: <strong>#{metrics.overallRank}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>

        {/* Action Button */}
        <CardActions>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleGetExplanation}
            sx={{ textTransform: "none" }}
          >
            🤖 Get AI Explanation
          </Button>
        </CardActions>
      </Card>

      {/* AI Explanation Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { maxHeight: "90vh" } }}
      >
        <DialogTitle>
          📋 Detailed Counseling Explanation
          <Typography variant="caption" color="textSecondary" display="block">
            {college} - {branch}
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : explanation ? (
            <>
              {explanationSource === "local" ||
              explanationSource === "error_fallback" ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Generated using local rule-based counseling logic
                </Alert>
              ) : null}
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
              >
                {explanation}
              </Typography>
            </>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RecommendationCard;
