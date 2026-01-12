import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="header-wrapper">
      <div className="logos-section">
        <img
          src="/src/assets/HeaderAndLogo/Logo Dark mode.png"
          alt="Vision Logo"
          className="header-logo"
          onClick={() => navigate("/")}
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
          <a href="/contact" onClick={() => setMenuOpen(false)}>
            تواصل معنا
          </a>
        </nav>
      </header>
    </div>
  );
};

export default Header;
