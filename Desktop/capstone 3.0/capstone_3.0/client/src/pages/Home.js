import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const features = [
    {
      icon: "📊",
      title: "Smart Recommendations",
      description:
        "Get personalized college recommendations based on your JEE rank, category, and preferences using advanced algorithms.",
      link: "/recommendations",
    },
    {
      icon: "🤖",
      title: "AI-Powered Explanations",
      description:
        "Understand why a college is recommended with detailed AI-generated explanations and admission insights.",
      link: "/chat",
    },
    {
      icon: "📚",
      title: "Comprehensive Database",
      description:
        "Access information about NITs, IIITs, and other top engineering colleges with real cutoff data.",
      link: "/recommendations",
    },
  ];

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">University & Course Finder</h1>
          <p className="hero-subtitle">
            Set your preferences below and we'll match you with the best options
          </p>

          <div className="hero-buttons">
            <Link to="/recommendations" className="btn-primary">
              Get Recommendations
            </Link>
            <Link to="/chat" className="btn-secondary">
              Ask AI Assistant
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Our system analyzes your JEE rank, category, and preferences to
            provide personalized college recommendations categorized as Safe,
            Target, or Dream options.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <Link to={feature.link} className="feature-link">
                Learn More →
              </Link>
            </div>
          ))}
        </div>

        {/* Categories Explained */}
        <div className="categories-section">
          <h3 className="categories-title">Categories Explained</h3>
          <div className="categories-grid">
            <div className="category-chip chip-safe">
              <strong>Safe:</strong> High chance of admission
            </div>
            <div className="category-chip chip-target">
              <strong>Target:</strong> Moderate chance of admission
            </div>
            <div className="category-chip chip-dream">
              <strong>Dream:</strong> Low chance but worth applying
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
