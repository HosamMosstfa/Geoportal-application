import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useTheme } from "../../../context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="header-wrapper">
      <div className="logos-section">
        <img
          src={
            theme === "dark"
              ? "/src/assets/HeaderAndLogo/Logo Dark mode.png"
              : "/src/assets/HeaderAndLogo/Logo Light mode.png"
          }
          alt="Vision Logo"
          className="header-logo"
          onClick={() => navigate("/")}
          onError={(e) => {
            e.target.src = "/src/assets/HeaderAndLogo/Logo Dark mode.png";
          }}
        />
      </div>

      <header className="top-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="/" onClick={() => setMenuOpen(false)}>
            الرئيسية
          </a>
          <a href="/map" onClick={() => setMenuOpen(false)}>
            لوحة التحكم
          </a>
          <a href="/#" onClick={() => setMenuOpen(false)}>
            الخريطة
          </a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>
            تواصل معنا
          </a>

          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title="Switch Theme"
          >
            {theme === "dark" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3V4M12 20V21M4 12H3M21 12H20M5.31412 5.31412L6.02115 6.02115M17.9789 17.9789L18.6859 18.6859M5.31412 18.6859L6.02115 17.9789M17.9789 6.02115L18.6859 5.31412"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.7522 15.0022C20.9928 15.4883 20.0963 15.7505 19.1468 15.7505C15.7645 15.7505 13.0189 13.0189 13.0189 9.62255C13.0189 7.97235 13.6841 6.47892 14.7578 5.39709C14.0754 5.1666 13.3444 5.04541 12.5833 5.04541C8.28315 5.04541 4.79395 8.53462 4.79395 12.8348C4.79395 17.135 8.28315 20.6242 12.5833 20.6242C16.4806 20.6242 19.7049 17.756 20.3015 14.0156C20.8034 14.2836 21.2974 14.6158 21.7522 15.0022Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </nav>
      </header>
    </div>
  );
};

export default Header;
