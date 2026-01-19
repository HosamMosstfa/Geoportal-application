import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="vision-container">
        <div className="vision-box" onClick={() => navigate("/map")}>
          <h2 className="vision-title">
            رؤية <br /> المشروع
          </h2>
          <span className="arrow-icon" style={{ transform: "revert" }}>
            ➤
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
