import { useState, useRef, useEffect } from "react";

import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

const NAVBAR_HEIGHT = 60;

function MainLayout() {
  const [showLeft] = useState(true);
  const [showRight] = useState(true);
  const mapRef = useRef(null);
  const [theme, setTheme] = useState("dark");

  // Apply theme to document for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Navbar */}
      <div style={{ height: NAVBAR_HEIGHT }}>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          position: "relative",
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          paddingLeft: showLeft ? 260 : 0,
          paddingRight: showRight ? 260 : 0,
        }}
      >
        {/* Map */}
        <MapView ref={mapRef} theme={theme} />

        {/* Left Sidebar */}
        {showLeft && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 260,
              height: "100%",
              background: "var(--bg-sidebar)",
              borderRight: "none",
              borderRadius: 0,
              boxShadow: "var(--shadow-sidebar)",
              zIndex: 20,
              overflow: 'hidden'
            }}
          >
            <LeftSidebar theme={theme} />
          </div>
        )}

        {/* Right Sidebar */}
        {showRight && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 260,
              height: "100%",
              background: "var(--bg-sidebar)",
              borderLeft: "none",
              borderRadius: 0,
              boxShadow: "var(--shadow-sidebar)",
              zIndex: 20,
              overflow: 'hidden'
            }}
          >
            <RightSidebar
              theme={theme}
              onZoom={(name) => mapRef.current && mapRef.current.zoomToFeatureByName(name)}
              onZoomAll={() => mapRef.current && mapRef.current.fitToAll()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MainLayout;
