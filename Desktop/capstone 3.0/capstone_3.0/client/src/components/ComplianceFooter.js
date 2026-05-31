import React from "react";
import { Box, Typography, Container, Link, Grid, Divider } from "@mui/material";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GavelIcon from "@mui/icons-material/Gavel";
import PeopleIcon from "@mui/icons-material/People";
import "../styles/ComplianceFooter.css";

/**
 * COMPLIANCE & ETHOS FOOTER
 *
 * Displays critical compliance information:
 * - Digital Personal Data Protection (DPDP) Act adherence
 * - Human-in-the-Loop Decision Support Framework
 * - Data Privacy & Usage Policy
 * - Ethical AI Guidelines
 */
const ComplianceFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      className="compliance-footer"
      sx={{ backgroundColor: "#1a1a1a", color: "#fff", mt: 6 }}
    >
      <Container maxWidth="lg">
        {/* Main Content */}
        <Grid container spacing={4} sx={{ py: 4 }}>
          {/* Column 1: DPDP Compliance */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
              <PrivacyTipIcon sx={{ fontSize: "1.8rem", color: "#4CAF50" }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  📋 Data Privacy Compliance
                </Typography>
                <Typography variant="body2" paragraph>
                  This system adheres to the{" "}
                  <strong>
                    Digital Personal Data Protection (DPDP) Act, 2023
                  </strong>{" "}
                  of India and implements comprehensive data privacy safeguards.
                </Typography>
                <Typography variant="body2">
                  <strong>Data Collection:</strong> We collect only essential
                  information (rank, category, location preference) needed for
                  recommendation generation.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Column 2: Human-in-the-Loop */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
              <PeopleIcon sx={{ fontSize: "1.8rem", color: "#2196F3" }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  👥 Human-in-the-Loop Framework
                </Typography>
                <Typography variant="body2" paragraph>
                  This system is a <strong>Decision Support Engine</strong>, NOT
                  an autonomous decision-maker.
                </Typography>
                <Typography variant="body2">
                  <strong>Recommendation Purpose:</strong> Our AI-powered
                  recommendations are designed to supplement, not replace,
                  professional counseling. Always consult with certified JEE
                  counselors and verify information on official JoSAA portal
                  before making final decisions.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Column 3: Legal & Disclaimers */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
              <GavelIcon sx={{ fontSize: "1.8rem", color: "#FF9800" }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  ⚖️ Legal Disclaimers
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Accuracy:</strong> Cutoff data is sourced from
                  official JoSAA archives but may not reflect real-time updates.
                </Typography>
                <Typography variant="body2">
                  <strong>Liability:</strong> We are not liable for admission
                  decisions made based on this system's recommendations. Final
                  decisions rest with the user.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#444", my: 3 }} />

        {/* Detailed Compliance Sections */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* DPDP Act Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ color: "#4CAF50" }}>
              🔒 DPDP Act Compliance Details
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Data Fiduciary:</strong> This system acts as a Data
              Fiduciary under the DPDP Act.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>User Rights:</strong> You have the right to:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ ml: 2 }}>
              <li>Request access to personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data (Right to be Forgotten)</li>
              <li>Withdraw consent for data processing at any time</li>
              <li>Lodge complaints with data protection authorities</li>
            </Typography>
            <Typography variant="body2" paragraph sx={{ mt: 1 }}>
              <strong>Data Storage:</strong> Personal data is stored securely
              using industry-standard encryption and is retained only as long as
              necessary for the stated purpose.
            </Typography>
            <Typography variant="body2">
              <strong>Third-Party Sharing:</strong> Your data is not shared with
              third parties without explicit consent, except as required by law.
            </Typography>
          </Grid>

          {/* AI Transparency */}
          <Grid item xs={12}>
            <Divider sx={{ borderColor: "#444", my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: "#2196F3" }}>
              🤖 AI Transparency & Explainability
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Algorithm:</strong> Our recommendation engine uses a
              hybrid approach combining:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ ml: 2 }}>
              <li>
                <strong>Content-Based Filtering:</strong> Matches your academic
                profile with college characteristics
              </li>
              <li>
                <strong>Collaborative Filtering:</strong> Learns from patterns
                of similar students
              </li>
              <li>
                <strong>ML Classification:</strong> Random Forest model predicts
                admission probability
              </li>
            </Typography>
            <Typography variant="body2" paragraph sx={{ mt: 1 }}>
              <strong>Explainability:</strong> Every recommendation includes
              detailed explanations of why a college is suggested, including
              admission probability, branch prestige, placement metrics, and
              your profile fit.
            </Typography>
            <Typography variant="body2">
              <strong>Bias Mitigation:</strong> Our system is designed to
              provide equal recommendations across all categories (General, OBC,
              SC, ST) while respecting official reservation policies.
            </Typography>
          </Grid>

          {/* Ethical Guidelines */}
          <Grid item xs={12}>
            <Divider sx={{ borderColor: "#444", my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: "#FF9800" }}>
              ✨ Ethical AI Guidelines
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Fairness:</strong> Our system treats all students
              equitably, regardless of category or background.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Accountability:</strong> All recommendations are traceable
              and explainable.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Transparency:</strong> Users understand how and why
              recommendations are generated.
            </Typography>
            <Typography variant="body2">
              <strong>User Autonomy:</strong> Final decisions always remain with
              the user, never delegated to algorithms.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#444", my: 3 }} />

        {/* Footer Bottom */}
        <Box sx={{ py: 2, textAlign: "center" }}>
          <Typography
            variant="caption"
            color="textSecondary"
            display="block"
            paragraph
          >
            <strong>IMPORTANT DISCLAIMER:</strong> This system is an educational
            aid. It does not guarantee admission to any institution. Always
            verify information on official{" "}
            <Link
              href="https://josaa.admissions.nic.in/"
              target="_blank"
              rel="noopener"
              sx={{ color: "#4CAF50" }}
            >
              JoSAA portal
            </Link>
            .
          </Typography>

          <Typography
            variant="caption"
            color="textSecondary"
            display="block"
            paragraph
          >
            For support with data privacy concerns, please contact our Data
            Protection Officer at{" "}
            <Link
              href="mailto:privacy@college-advisor.edu"
              sx={{ color: "#4CAF50" }}
            >
              privacy@college-advisor.edu
            </Link>
            .
          </Typography>

          <Divider sx={{ borderColor: "#444", my: 2 }} />

          <Grid container spacing={2} sx={{ justifyContent: "center", mb: 2 }}>
            <Grid item>
              <Link
                href="#terms"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Terms of Service
              </Link>
            </Grid>
            <Grid item sx={{ color: "#666" }}>
              •
            </Grid>
            <Grid item>
              <Link
                href="#privacy"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Privacy Policy
              </Link>
            </Grid>
            <Grid item sx={{ color: "#666" }}>
              •
            </Grid>
            <Grid item>
              <Link
                href="#accessibility"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Accessibility
              </Link>
            </Grid>
            <Grid item sx={{ color: "#666" }}>
              •
            </Grid>
            <Grid item>
              <Link
                href="#contact"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Contact Us
              </Link>
            </Grid>
          </Grid>

          <Typography variant="caption" color="textSecondary">
            © {currentYear} AI-Powered College Recommendation System. All rights
            reserved. | Developed in adherence with DPDP Act, 2023 and AI ethics
            guidelines.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ComplianceFooter;
