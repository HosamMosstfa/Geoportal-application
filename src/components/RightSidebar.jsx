import React, { useEffect, useState } from "react";

function RightSidebar({ onZoom, onZoomAll }) {
  const [names, setNames] = useState([]);
  const [selected, setSelected] = useState("all");
  const [selectedCritical, setSelectedCritical] = useState("all");
  const [selectedRocky, setSelectedRocky] = useState("all");

  /* ---------- Styles using CSS Variables ---------- */
  const filterCard = {
    background: "var(--bg-card-gradient)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "12px",
    boxShadow: "var(--shadow-card)",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "6px",
    display: "block",
    color: "var(--text-primary)",
  };

  const selectStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  };

  useEffect(() => {
    fetch("/data/stations.geojson")
      .then((r) => r.json())
      .then((geo) => {
        // Derive simple symbol category based on Name
        let sampleCounter = 1;
        geo.features.forEach((f) => {
          const name = f.properties && String(f.properties.Name || "");
          const type = f.properties && String(f.properties.Type || "");
          let sym = "other";
          if (type === "Sample") {
            sym = "Samples";
            f.properties = { ...f.properties, _sym: sym, _sampleIndex: sampleCounter };
            sampleCounter += 1;
          } else {
            if (name === "Critical") sym = "Critical";
            else if (name === "Transitional") sym = "Transitional";
            else if (/s/i.test(name) && name.toLowerCase() !== "samples") sym = "S";
            else if (/^n/i.test(name)) sym = "n";
            f.properties = { ...f.properties, _sym: sym };
          }
        });

        const unique = Array.from(
          new Set(geo.features.map((f) => f.properties && f.properties.Name))
        ).filter(Boolean);
        setNames(unique);
      })
      .catch(() => {
        setNames([]);
      });
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setSelected(val);
    if (val === "all") {
      onZoomAll && onZoomAll();
    } else {
      onZoom && onZoom(val);
    }
  }

  function handleCriticalChange(e) {
    const val = e.target.value;
    setSelectedCritical(val);
    if (val === "all") onZoomAll && onZoomAll();
    else onZoom && onZoom(val);
  }

  function handleRockyChange(e) {
    const val = e.target.value;
    setSelectedRocky(val);
    if (val === "all") onZoomAll && onZoomAll();
    else onZoom && onZoom(val);
  }

  return (
    <div
      style={{
        padding: "12px",
        height: "100%",
        overflowY: "auto",
        background: "transparent",
        color: "var(--text-primary)",
      }}
    >
      <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>الفلاتر والمعلومات</h3>

      {/* ---------- Filters ---------- */}
      <div style={{ marginBottom: "20px" }}>
        <div style={filterCard}>
          <label style={labelStyle}>المنطقة الحرجة</label>
          <select value={selectedCritical} onChange={handleCriticalChange} style={selectStyle}>
            <option value="all">الكل</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div style={filterCard}>
          <label style={labelStyle}>مناطق صخرية</label>
          <select value={selectedRocky} onChange={handleRockyChange} style={selectStyle}>
            <option value="all">الكل</option>
            <option value="Transitional">Transitional</option>
          </select>
        </div>

        <div style={filterCard}>
          <label style={labelStyle}>فلتر بالاسم</label>
          <select value={selected} onChange={handleChange} style={selectStyle}>
            <option value="all">الكل</option>
            {names.map((n, i) => (
              <option key={i} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

    
      <div style={{ marginTop: 12, padding: 10, background: "var(--bg-card-gradient)", borderRadius: 8, border: "1px solid var(--border-light)", fontSize: 14, color: "var(--text-primary)" }}>
        Project for Slope and Rockfall Hazard Assessment in the Holy Sites and Implementation of Engineering Protection Measures
        <div style={{ marginTop: 6, fontWeight: 700, fontSize: 14 }}>Project Code: T-2025-82</div>
      </div>
    </div>
  );
}

export default RightSidebar;
