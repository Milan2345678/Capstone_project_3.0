import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChatIcon from "@mui/icons-material/Chat";
import SchoolIcon from "@mui/icons-material/School";

const Home = () => {
  const features = [
    {
      title: "Smart Recommendations",
      description:
        "Get personalized college recommendations based on your JEE rank, category, and preferences using advanced algorithms.",
      icon: <TrendingUpIcon fontSize="large" color="primary" />,
      link: "/recommendations",
    },
    {
      title: "AI-Powered Explanations",
      description:
        "Understand why a college is recommended with detailed AI-generated explanations and admission insights.",
      icon: <ChatIcon fontSize="large" color="primary" />,
      link: "/chat",
    },
    {
      title: "Comprehensive Database",
      description:
        "Access information about NITs, IIITs, and other top engineering colleges with real cutoff data.",
      icon: <SchoolIcon fontSize="large" color="primary" />,
      link: "/recommendations",
    },
  ];

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom color="primary">
        AI-Based College Recommendation System
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        color="text.secondary"
      >
        Make smarter JEE counseling decisions with data-driven recommendations
      </Typography>

      <Box sx={{ my: 4 }}>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/recommendations"
          sx={{ mr: 2, px: 4, py: 1.5 }}
        >
          Get Recommendations
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/chat"
          sx={{ px: 4, py: 1.5 }}
        >
          Ask AI Assistant
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Our system analyzes your JEE rank, category, and preferences to
          provide personalized college recommendations categorized as Safe,
          Target, or Dream options.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button size="small" component={Link} to={feature.link}>
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, p: 3, bgcolor: "grey.100", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Categories Explained
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label="Safe: High chance of admission"
            color="success"
            variant="outlined"
          />
          <Chip
            label="Target: Moderate chance of admission"
            color="warning"
            variant="outlined"
          />
          <Chip
            label="Dream: Low chance but worth applying"
            color="error"
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
