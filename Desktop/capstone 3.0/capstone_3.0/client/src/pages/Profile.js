import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    rank: "",
    category: "",
    state: "",
    budget: "",
    preferredBranches: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // For demo purposes, we'll use localStorage. In production, this would be an API call
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBranchToggle = (branch) => {
    setProfile((prev) => ({
      ...prev,
      preferredBranches: prev.preferredBranches.includes(branch)
        ? prev.preferredBranches.filter((b) => b !== branch)
        : [...prev.preferredBranches, branch],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage for demo. In production, this would be an API call
      localStorage.setItem("userProfile", JSON.stringify(profile));
      setMessage("Profile saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={profile.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            JEE Information
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="JEE Rank"
                type="number"
                value={profile.rank}
                onChange={(e) => handleInputChange("rank", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={profile.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Preferred State</InputLabel>
                <Select
                  value={profile.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                >
                  <MenuItem value="">Select State</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Budget (₹ per year)"
                type="number"
                value={profile.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Preferred Branches
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {branches.map((branch) => (
              <Chip
                key={branch}
                label={branch}
                onClick={() => handleBranchToggle(branch)}
                color={
                  profile.preferredBranches.includes(branch)
                    ? "primary"
                    : "default"
                }
                variant={
                  profile.preferredBranches.includes(branch)
                    ? "filled"
                    : "outlined"
                }
              />
            ))}
          </Box>

          {message && (
            <Alert
              severity={message.includes("Error") ? "error" : "success"}
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            size="large"
          >
            {saving ? <CircularProgress size={24} /> : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
