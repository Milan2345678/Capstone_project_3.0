import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Chip,
  Slider,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import "../styles/FormWizard.css";

const BRANCH_OPTIONS = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
];

const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST"];

/**
 * MULTI-STEP FORM WIZARD
 *
 * Step 1: Academic Vector Inputs (Rank, Category, Branches)
 * Step 2: Socio-Economic Feature Inputs (Budget, Location)
 * Step 3: Algorithm Balancing Factor (Alpha Slider)
 *
 * Aligned with research paper specifications for user profiling.
 */
const FormWizard = ({ onSubmit, loading = false }) => {
  const [activeStep, setActiveStep] = useState(0);

  // Step 1: Academic Profile
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("");
  const [preferredBranches, setPreferredBranches] = useState([]);

  // Step 2: Socio-Economic Profile
  const [maxBudget, setMaxBudget] = useState(500000);
  const [budgetLabel, setBudgetLabel] = useState("₹5 Lakhs");
  const [state, setState] = useState("");

  // Step 3: Algorithm Tuning
  const [alphaWeight, setAlphaWeight] = useState(0.6);

  const handleAddBranch = (branch) => {
    if (!preferredBranches.includes(branch)) {
      setPreferredBranches([...preferredBranches, branch]);
    }
  };

  const handleRemoveBranch = (branch) => {
    setPreferredBranches(preferredBranches.filter((b) => b !== branch));
  };

  const handleBudgetChange = (event, newValue) => {
    setMaxBudget(newValue);
    const lakhs = (newValue / 100000).toFixed(1);
    setBudgetLabel(`₹${lakhs} Lakhs`);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!rank || !category) {
        alert("Please enter rank and select category");
        return;
      }
    }
    if (activeStep === 1) {
      if (!state) {
        alert("Please select a location");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (!rank || !category || !state) {
      alert("Please fill all required fields");
      return;
    }

    const formData = {
      rank: parseInt(rank),
      category,
      preferredBranches,
      budget: maxBudget,
      state,
      alphaWeight: alphaWeight, // Algorithm balancing factor
      preferenceWeight: Math.round((1 - alphaWeight) * 100), // Legacy naming for backend compatibility
    };

    onSubmit(formData);
  };

  const stateOptions = [
    "All locations",
    "Delhi",
    "Maharashtra",
    "Tamil Nadu",
    "Uttar Pradesh",
    "West Bengal",
    "Karnataka",
    "Telangana",
    "Rajasthan",
    "Punjab",
  ];

  return (
    <Card className="form-wizard-card">
      <CardContent>
        <Typography variant="h5" gutterBottom className="wizard-title">
          🎯 College Recommendation Wizard
        </Typography>

        <Stepper activeStep={activeStep} className="wizard-stepper">
          <Step>
            <StepLabel>Academic Profile</StepLabel>
          </Step>
          <Step>
            <StepLabel>Preferences</StepLabel>
          </Step>
          <Step>
            <StepLabel>Algorithm Tuning</StepLabel>
          </Step>
        </Stepper>

        <Box className="wizard-content">
          {/* STEP 1: ACADEMIC VECTOR INPUTS */}
          {activeStep === 0 && (
            <Box className="step-container">
              <Typography variant="h6" gutterBottom>
                📚 Academic Profile
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Enter your JEE rank and academic preferences
              </Typography>

              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
              >
                {/* Rank Input */}
                <TextField
                  label="JEE Rank"
                  type="number"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  fullWidth
                  placeholder="e.g., 15000"
                  helperText="Enter your All India Rank (AIR)"
                  inputProps={{ min: 1, max: 500000 }}
                />

                {/* Category Dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Branch Selection */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Preferred Branches (Optional)
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {preferredBranches.map((branch) => (
                      <Chip
                        key={branch}
                        label={branch}
                        onDelete={() => handleRemoveBranch(branch)}
                        color="primary"
                        variant="filled"
                      />
                    ))}
                  </Box>
                  <FormControl fullWidth>
                    <InputLabel>Add Branch</InputLabel>
                    <Select
                      value=""
                      label="Add Branch"
                      onChange={(e) => handleAddBranch(e.target.value)}
                    >
                      {BRANCH_OPTIONS.map((branch) => (
                        <MenuItem key={branch} value={branch}>
                          {branch}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          )}

          {/* STEP 2: SOCIO-ECONOMIC FEATURE INPUTS */}
          {activeStep === 1 && (
            <Box className="step-container">
              <Typography variant="h6" gutterBottom>
                💰 Preferences & Location
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Set your budget and preferred location
              </Typography>

              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}
              >
                {/* Budget Slider */}
                <Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">Annual Budget</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {budgetLabel}
                    </Typography>
                  </Box>
                  <Slider
                    value={maxBudget}
                    onChange={handleBudgetChange}
                    min={100000}
                    max={2000000}
                    step={50000}
                    sx={{ mt: 2 }}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) =>
                      `₹${(value / 100000).toFixed(1)}L`
                    }
                  />
                  <Typography variant="caption" color="textSecondary">
                    Helps filter colleges within your budget
                  </Typography>
                </Box>

                {/* Location Selection */}
                <FormControl fullWidth>
                  <InputLabel>Preferred Location</InputLabel>
                  <Select
                    value={state}
                    label="Preferred Location"
                    onChange={(e) => setState(e.target.value)}
                  >
                    {stateOptions.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    Select your preferred state or "All locations" for
                    nationwide options
                  </Typography>
                </FormControl>
              </Box>
            </Box>
          )}

          {/* STEP 3: ALGORITHM BALANCING FACTOR */}
          {activeStep === 2 && (
            <Box className="step-container">
              <Alert severity="info" sx={{ mb: 2 }}>
                <InfoIcon sx={{ mr: 1 }} />
                Adjust the algorithm balance below to control recommendation
                behavior
              </Alert>

              <Typography variant="h6" gutterBottom>
                ⚙️ Algorithm Balancing Factor (α)
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>Content-Based Similarity</strong>
                  </Typography>
                  <Typography variant="body2">
                    <strong>Random Forest Classifier</strong>
                  </Typography>
                </Box>

                <Slider
                  value={alphaWeight}
                  onChange={(e, newValue) => setAlphaWeight(newValue)}
                  min={0}
                  max={1}
                  step={0.05}
                  marks={[
                    { value: 0, label: "0% (ML Only)" },
                    { value: 0.5, label: "50%" },
                    { value: 1, label: "100% (Content)" },
                  ]}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                />

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" gutterBottom>
                    <strong>Current Formula:</strong>
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "monospace", display: "block", mt: 1 }}
                  >
                    R<sub>final</sub> = {alphaWeight.toFixed(2)} × Sim(S,C) +{" "}
                    {(1 - alphaWeight).toFixed(2)} × P<sub>RF</sub>
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      <strong>Description:</strong>
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      display="block"
                    >
                      • <strong>Sim(S,C):</strong> Content-Based Similarity
                      between your profile and college
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      display="block"
                    >
                      •{" "}
                      <strong>
                        P<sub>RF</sub>:
                      </strong>{" "}
                      Predicted probability from Random Forest Classifier
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      <strong>Recommendation:</strong>
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      {alphaWeight > 0.6
                        ? "✅ Balanced towards Content-Based filtering - Recommendations will emphasize your explicit preferences"
                        : alphaWeight < 0.4
                          ? "✅ Balanced towards ML Predictions - Recommendations will emphasize historical patterns"
                          : "✅ Fully Balanced - Both content similarity and ML predictions contribute equally"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>

          {activeStep < 2 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              {loading ? "Generating..." : "Get Recommendations"}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FormWizard;
