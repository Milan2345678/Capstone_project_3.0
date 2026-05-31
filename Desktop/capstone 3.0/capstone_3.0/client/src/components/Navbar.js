import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">📚</div>
        <span className="navbar-title">College Advisor</span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={`navbar-link ${isActive("/") ? "active" : ""}`}>
          Home
        </Link>
        <Link
          to="/recommendations"
          className={`navbar-link ${isActive("/recommendations") ? "active" : ""}`}
        >
          Recommendations
        </Link>
        <Link
          to="/chat"
          className={`navbar-link ${isActive("/chat") ? "active" : ""}`}
        >
          AI Chat
        </Link>
        <Link
          to="/profile"
          className={`navbar-link ${isActive("/profile") ? "active" : ""}`}
        >
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
