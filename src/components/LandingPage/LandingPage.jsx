import React from "react";
import "./LandingPage.css";

import Header from "./header/Header";
import HeroSection from "./HeroSection/HeroSection";
import ServicesSection from "./Service-section/ServicesSection";
import MapSection from "./Map-section/MapSection";
import FieldGallery from "./FieldGallery/FieldGallery";
import ContactFooter from "./ContactFooter/ContactFooter";
import SectionDivider from "./SectionDivider/SectionDivider";
const LandingPage = () => {
  return (
    <div className="golden-contour-bg" dir="rtl">
      <Header />
      <HeroSection />

      <ServicesSection />

      <SectionDivider />

      <MapSection />

      <SectionDivider />

      <FieldGallery />

      <SectionDivider />

      <ContactFooter />
    </div>
  );
};

export default LandingPage;
