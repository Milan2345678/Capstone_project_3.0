# Integration Guide: Refactored Recommendation Engine & Components

## Overview

This guide explains how to integrate the new components and backend fixes into your existing React/Node.js application.

---

## **BACKEND INTEGRATION (Node.js/Express)**

### 1. ✅ Already Updated: `collegeController.js`

The backend has been completely refactored with:

- **FIX #1**: Corrected cutoff inversion logic in `calculateAdmissionProbability()`
  - Lower rank = better performance
  - Proper Safe/Target/Dream categorization

- **FIX #2**: Dynamic placement score normalization in `getPlacementScore()`
  - Replaced hardcoded ceiling (2000000)
  - Adaptive percentile-based scaling
  - Top-tier institutions properly differentiated

- **FIX #3**: AI Explanation with local fallback in `getAIExplanation()`
  - Graceful error handling
  - Rule-based local generation (no OpenAI dependency)
  - Professional counseling responses

### 2. Environment Configuration

Ensure your `.env` file includes:

```env
OPENAI_API_KEY=your_key_here  # Optional - system works without it
MONGO_URI=mongodb://localhost:27017/college_recommendation
NODE_ENV=development
PORT=5000
```

### 3. Test the Backend

```bash
# Test AI Explanation endpoint (with local fallback)
curl -X POST http://localhost:5000/api/colleges/ai-explanation \
  -H "Content-Type: application/json" \
  -d '{
    "college": "IIT Delhi",
    "branch": "Computer Science",
    "rank": 3000,
    "category": "General",
    "cutoff": 90
  }'
```

---

## **FRONTEND INTEGRATION (React)**

### 1. Import New Components in Your App

Update `client/src/App.js`:

```javascript
import FormWizard from "./components/FormWizard";
import RecommendationsHub from "./components/RecommendationsHub";
import RecommendationCard from "./components/RecommendationCard";
import ComplianceFooter from "./components/ComplianceFooter";

// Add these to your routes or pages
```

### 2. Update Recommendations Page

Modify `client/src/pages/Recommendations.js` (or create if doesn't exist):

```javascript
import React, { useState } from "react";
import axios from "axios";
import FormWizard from "../components/FormWizard";
import RecommendationsHub from "../components/RecommendationsHub";
import ComplianceFooter from "../components/ComplianceFooter";
import { CircularProgress, Box } from "@mui/material";

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/colleges/recommendations",
        formData,
      );

      setRecommendations(response.data.recommendations);
      setStudentProfile({
        rank: formData.rank,
        category: formData.category,
        alphaWeight: formData.alphaWeight,
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Failed to generate recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {!recommendations ? (
        <Box sx={{ p: 3 }}>
          <FormWizard onSubmit={handleFormSubmit} loading={loading} />
        </Box>
      ) : (
        <>
          <Box sx={{ p: 3 }}>
            <RecommendationsHub
              recommendations={recommendations}
              studentProfile={studentProfile}
              loading={loading}
            />
          </Box>
          <ComplianceFooter />
        </>
      )}
    </Box>
  );
};

export default RecommendationsPage;
```

### 3. Add Route in App.js

```javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecommendationsPage from "./pages/Recommendations";

function App() {
  return (
    <Router>
      <Routes>
        {/* ... existing routes ... */}
        <Route path="/recommendations" element={<RecommendationsPage />} />
      </Routes>
    </Router>
  );
}
```

### 4. Update API Endpoint

The backend expects this endpoint:

```
POST /api/colleges/recommendations
Body: {
  rank: number,
  category: string,
  preferredBranches: string[],
  budget: number,
  state: string,
  alphaWeight: number (0-1),
  preferenceWeight: number (0-100) // for backward compatibility
}
```

Your existing route should work if it already has this structure.

---

## **COMPONENT FEATURES OVERVIEW**

### FormWizard

- **3-Step wizard** for user profiling
- **Step 1**: Academic profile (rank, category, branches)
- **Step 2**: Socio-economic preferences (budget, location)
- **Step 3**: Algorithm tuning (alpha weight slider)
- Integrated formula visualization: `R_final = α × Sim(S,C) + (1-α) × P_RF`

### RecommendationsHub

- **Categorized display**: Safe | Target | Dream
- **Tab navigation** between categories
- **Summary statistics** showing distribution
- **Student profile card** displaying input parameters
- **Counseling tips** for JoSAA choice order strategy

### RecommendationCard

- **College metrics**: NIRF ranking, fees, placement packages
- **Admission probability** with visual categorization
- **Score breakdown**: Branch, College, Placement, Probability scores
- **AI Explanation modal**: Click button to get detailed counseling
- **Responsive design** for mobile/tablet

### ComplianceFooter

- **DPDP Act compliance** section with user rights
- **Human-in-the-Loop** notice and disclaimer
- **Ethical AI guidelines** transparency
- **Data privacy** detailed explanations
- **Legal disclaimers** and contact information

---

## **STYLING INTEGRATION**

All CSS files are already created. Ensure they're properly imported:

```javascript
// In your component files (already done)
import "../styles/FormWizard.css";
import "../styles/RecommendationCard.css";
import "../styles/RecommendationsHub.css";
import "../styles/ComplianceFooter.css";
```

Color Scheme:

- **Primary**: `#667eea` (Purple-Blue gradient)
- **Safe**: `#28a745` (Green)
- **Target**: `#ffc107` (Yellow)
- **Dream**: `#dc3545` (Red)

---

## **API ENDPOINTS NEEDED**

### 1. Get Recommendations (Existing)

```
POST /api/colleges/recommendations
```

### 2. Get AI Explanation (Updated with Fallback)

```
POST /api/colleges/ai-explanation
Body: {
  college: string,
  branch: string,
  rank: number,
  category: string,
  cutoff: number
}
Response: {
  success: boolean,
  explanation: string,
  source: "openai" | "local" | "fallback"
}
```

---

## **TESTING CHECKLIST**

- [ ] Backend starts without errors: `node server.js`
- [ ] AI Explanation endpoint works (test with curl above)
- [ ] Frontend renders FormWizard without errors
- [ ] Form submission generates recommendations
- [ ] RecommendationsHub displays Safe/Target/Dream tabs
- [ ] Clicking "Get AI Explanation" opens modal with content
- [ ] Works without OPENAI_API_KEY (uses local fallback)
- [ ] Compliance footer displays at bottom of page
- [ ] Mobile responsive design works on small screens
- [ ] Alpha weight slider updates formula display in real-time

---

## **TROUBLESHOOTING**

### Issue: "AI failed" error in modal

**Solution**: Backend now has local fallback. Check browser console for details. System should work even without OpenAI API key.

### Issue: Form wizard not showing

**Solution**: Ensure all MUI components are imported in your project.

```bash
npm install @mui/material @mui/icons-material
```

### Issue: Styles not applying

**Solution**: Ensure CSS files are in correct path and imported in components.

### Issue: Recommendations not displaying

**Solution**:

1. Verify backend endpoint returns correct structure
2. Check browser console for API errors
3. Confirm data format matches schema

---

## **CUSTOMIZATION OPTIONS**

### Modify Category Thresholds

In `collegeController.js`, adjust `getCategoryTag()`:

```javascript
static getCategoryTag(probability) {
  if (probability >= 0.75) return "safe";      // Change 0.75
  if (probability >= 0.45) return "target";    // Change 0.45
  return "dream";
}
```

### Adjust Color Scheme

Update in CSS files:

- FormWizard.css: `#667eea`
- RecommendationCard.css: Safe/Target/Dream colors
- ComplianceFooter.css: Accent colors

### Modify Algorithm Formula Display

In `FormWizard.js`, update the formula text:

```javascript
R<sub>final</sub> = {alphaWeight.toFixed(2)} × Sim(S,C) + {(1 - alphaWeight).toFixed(2)} × P<sub>RF</sub>
```

---

## **DEPLOYMENT CHECKLIST**

- [ ] Remove console.log statements
- [ ] Test all endpoints in production-like environment
- [ ] Verify OPENAI_API_KEY is set (optional but recommended)
- [ ] Ensure database connection is secure
- [ ] Set NODE_ENV=production
- [ ] Test mobile responsiveness
- [ ] Verify compliance footer links work
- [ ] Run security audit on dependencies

---

## **PERFORMANCE OPTIMIZATION**

1. **Lazy load components**:

```javascript
const FormWizard = React.lazy(() => import("./components/FormWizard"));
```

2. **Memoize expensive components**:

```javascript
export default React.memo(RecommendationCard);
```

3. **Optimize images and icons**
4. **Enable gzip compression** on server

---

## **SUPPORT & DOCUMENTATION**

For questions or issues:

1. Check console for error messages
2. Review component prop definitions
3. Test backend endpoints independently
4. Verify data structure matches schema
5. Check CSS files for styling issues

---

**Last Updated**: May 29, 2026
**Version**: 2.0 (Research Paper Aligned)
