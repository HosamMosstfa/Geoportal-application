import React, { useEffect, useState } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart } from "./charts/PieChart";

function RightSidebar({ onZoom, onZoomAll, theme = "light" }) {
  const [names, setNames] = useState([]);
  const [selected, setSelected] = useState("all");
  const [selectedCritical, setSelectedCritical] = useState("all");
  const [selectedRocky, setSelectedRocky] = useState("all");
  const [samplesData, setSamplesData] = useState([]);

  /* ---------- Dummy chart data (kept) ---------- */
  const data = [
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 300 },
    { name: "Category D", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  /* ---------- Styles ---------- */
  const filterCard = {
    background: theme === "light" ? "#fff" : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    border: theme === "light" ? "1px solid #ddd" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "12px",
    boxShadow: theme === "light" ? "0 1px 4px rgba(0,0,0,0.08)" : "0 1px 8px rgba(0,0,0,0.35)",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "6px",
    display: "block",
    color: theme === "light" ? "#333" : "#eaeaea",
  };

const selectStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "8px",
  border: theme === "light"
    ? "1px solid #ccc"
    : "1px solid rgba(255,255,255,0.15)",
  backgroundColor: theme === "light"
    ? "#f9f9f9"
    : "#1e1e1e",   // 👈 مهم
  color: theme === "light" ? "#111" : "#eaeaea",
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

        // Prepare samples data for pie chart
        const samples = geo.features.filter(f => f.properties && f.properties._sym === 'Samples');
        const samplesPieData = samples.map((f, index) => ({
          name: `Sample ${f.properties._sampleIndex || index + 1}`,
          value: 1, // Each sample counts as 1
          coordinates: f.geometry.coordinates,
        }));
        setSamplesData(samplesPieData);
      })
      .catch(() => {
        setNames([]);
        setSamplesData([]);
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
        color: theme === "light" ? "#111" : "#eaeaea",
      }}
    >
      <h3 style={{ marginBottom: "12px" }}>الفلاتر والمعلومات</h3>

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

      {/* ---------- Samples Pie Chart ---------- */}
        <div style={{ ...filterCard, height: '300px' }}>
        <PieChart data={samplesData} title="العينات وترقيمها وإحداثياتها" theme={theme} />
      </div>
      <div style={{ marginTop: 12, padding: 10, background: theme === 'light' ? '#fafafa' : 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', borderRadius: 8, border: theme === 'light' ? '1px solid #eee' : '1px solid rgba(255,255,255,0.06)', fontSize: 15, color: theme === 'light' ? '#222' : '#eaeaea' }}>
        Project for Slope and Rockfall Hazard Assessment in the Holy Sites and Implementation of Engineering Protection Measures
        <div style={{ marginTop: 6, fontWeight: 700 }}>Project Code: T-2025-82</div>
      </div>
    </div>
  );
}

export default RightSidebar;
