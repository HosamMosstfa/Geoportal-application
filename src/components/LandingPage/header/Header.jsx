import React from "react";
import "./Header.css";
const Header = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/src/assets/HeaderAndLogo/Header.png')",
        backgroundSize: "cover",
        backgroundColor: "black",
      }}
    >
      {/* Logos Section */}
      <div style={{ display: "flex", padding: "30px 20px" }}>
        <img
          src="/src/assets/HeaderAndLogo/Logo Dark mode.png"
          alt="Vision Logo"
          style={{ height: "80px" }}
        />
      </div>

      {/* Navbar */}
      <header className="top-header">
        <nav className="nav-links">
          <a href="#">الرئيسية</a>
          <a href="#">لوحة التحكم</a>
          <a href="#">تواصل معنا</a>
        </nav>
      </header>
    </div>
  );
};

export default Header;
