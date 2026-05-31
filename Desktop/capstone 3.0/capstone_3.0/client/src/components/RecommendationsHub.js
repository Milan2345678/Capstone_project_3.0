import React from "react";
import {
  Box,
  Typography,
  Grid,
  Tab,
  Tabs,
  Paper,
  Alert,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import RecommendationCard from "./RecommendationCard";
import "../styles/RecommendationsHub.css";

/**
 * RECOMMENDATIONS HUB COMPONENT
 *
 * Displays recommendations organized into:
 * - Safe Options (High probability ≥ 75%)
 * - Target Options (Moderate probability 45-75%)
 * - Dream Options (Low probability < 45%)
 *
 * Features:
 * - Tab-based navigation between categories
 * - Summary statistics and breakdown
 * - College cards with detailed metrics
 */
const RecommendationsHub = ({ recommendations, studentProfile, loading }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Generating Personalized Recommendations...
        </Typography>
        <LinearProgress sx={{ mb: 3 }} />
      </Box>
    );
  }

  if (!recommendations || !recommendations.safe) {
    return (
      <Alert severity="info">
        No recommendations available. Please refine your filters and try again.
      </Alert>
    );
  }

  const { safe, target, dream } = recommendations;
  const totalRecommendations = safe.length + target.length + dream.length;

  const categories = [
    {
      id: "safe",
      label: "🟢 Safe Options",
      description: "High probability of admission (≥ 75%)",
      color: "#d4edda",
      borderColor: "#28a745",
      data: safe,
      icon: "✅",
    },
    {
      id: "target",
      label: "🟡 Target Options",
      description: "Moderate probability (45-75%)",
      color: "#fff3cd",
      borderColor: "#ffc107",
      data: target,
      icon: "🎯",
    },
    {
      id: "dream",
      label: "🔵 Dream Options",
      description: "Challenging but worth pursuing (< 45%)",
      color: "#f8d7da",
      borderColor: "#dc3545",
      data: dream,
      icon: "💭",
    },
  ];

  const currentCategory = categories[selectedTab];

  return (
    <Box className="recommendations-hub" sx={{ width: "100%" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          📊 Your Personalized Recommendations
        </Typography>

        {/* Student Profile Summary */}
        <Paper sx={{ p: 2, backgroundColor: "#f5f5f5", mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  JEE Rank
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {studentProfile.rank.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Category
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {studentProfile.category}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Total Matches
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {totalRecommendations}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Algorithm Balance (α)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {studentProfile.alphaWeight
                    ? `${(studentProfile.alphaWeight * 100).toFixed(0)}%`
                    : "60%"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Category Distribution */}
        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={4} key={cat.id}>
              <Card
                sx={{
                  backgroundColor: cat.color,
                  borderLeft: `4px solid ${cat.borderColor}`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => setSelectedTab(categories.indexOf(cat))}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h5">{cat.icon}</Typography>
                    <Box>
                      <Typography variant="h6">{cat.data.length}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tab Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          {categories.map((cat, idx) => (
            <Tab
              key={cat.id}
              label={
                <>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {cat.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: cat.borderColor,
                      color: "white",
                      px: 1,
                      borderRadius: 1,
                    }}
                  >
                    {cat.data.length}
                  </Typography>
                </>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Category Content */}
      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            {currentCategory.label}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {currentCategory.description}
          </Typography>
        </Box>

        {currentCategory.data.length > 0 ? (
          <Grid container spacing={3}>
            {currentCategory.data.map((recommendation, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <RecommendationCard
                  recommendation={recommendation}
                  categoryColor={currentCategory.color}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            No {currentCategory.id} options available for your profile. Consider
            adjusting your preferences or expanding your search criteria.
          </Alert>
        )}
      </Box>

      {/* Counseling Tips */}
      <Paper
        sx={{
          mt: 4,
          p: 3,
          backgroundColor: "#f0f7ff",
          borderLeft: "4px solid #1976d2",
        }}
      >
        <Typography variant="h6" gutterBottom>
          📝 JoSAA Choice Order Strategy
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Safe Options:</strong> Place these in the top of your choice
          order to secure admission to a good college. These have high success
          probability.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Target Options:</strong> Place these in the middle section.
          These represent realistic stretch goals with reasonable chances.
        </Typography>
        <Typography variant="body2">
          <strong>Dream Options:</strong> Place these towards the end. While
          challenging, including them allows you to aim high without risking
          your overall strategy.
        </Typography>
      </Paper>
    </Box>
  );
};

export default RecommendationsHub;
