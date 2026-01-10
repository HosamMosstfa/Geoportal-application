import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

function LeftSidebar({ theme = "light" }) {
  /* ---------- Dummy Data ---------- */

  // Elevation scale values provided by the user
  const elevationTicks = [981, 875, 750, 625, 500, 375, 264];
  const elevationData = elevationTicks.map((v, i) => ({ name: `${v} m`, elevation: v }));

  const slopeData = [
    { name: "نقطة 1", slope: 5 },
    { name: "نقطة 2", slope: 10 },
    { name: "نقطة 3", slope: 15 },
    { name: "نقطة 4", slope: 8 },
    { name: "نقطة 5", slope: 12 },
  ];

  /* ---------- Stats ---------- */

  const stats = [
    { title: "عدد العينات", value: 7 },
    { title: "عدد المحطات", value: 506 },
    { title: "عدد المناطق الحرجة", value: 1 },
  ];

  /* ---------- Styles ---------- */
  const cardStyle = (theme) => ({
    border: theme === "light" ? "1px solid #dcdcdc" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px",
    padding: "12px",
    background: theme === "light" ? "#fff" : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    textAlign: "center",
    marginBottom: "12px",
    boxShadow: theme === "light" ? "0 1px 4px rgba(0,0,0,0.08)" : "0 1px 8px rgba(0,0,0,0.35)",
  });

  const cardTitle = (theme) => ({
    fontSize: "13px",
    color: theme === "light" ? "#555" : "#ddd",
    marginBottom: "6px",
  });

  const cardValue = (theme) => ({
    fontSize: "26px",
    fontWeight: "bold",
    color: theme === "light" ? "#000" : "#fff",
  });

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
      <h3 style={{ marginBottom: "12px" }}>تحليلات</h3>

      {/* ---------- Number Cards ---------- */}
      <div style={{ marginBottom: "20px" }}>
        {stats.map((item, index) => (
          <div key={index} style={cardStyle(theme)}>
            <div style={cardTitle(theme)}>{item.title}</div>
            <div style={cardValue(theme)}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* ---------- Bar Chart ---------- */}
      <div style={{ marginBottom: "24px" }}>
        <h4>الارتفاعات</h4>
        <BarChart width={220} height={200} data={elevationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis ticks={elevationTicks} domain={[Math.min(...elevationTicks), Math.max(...elevationTicks)]} tickFormatter={(v) => `${v} m`} />
          <Tooltip formatter={(value) => `${value} m`} />
          <Legend />
          <Bar dataKey="elevation" fill="#8884d8" />
        </BarChart>
      </div>

      {/* ---------- Line Chart ---------- */}
      <div>
        <h4>الانحدارات</h4>
        <LineChart width={220} height={200} data={slopeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="slope" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}

export default LeftSidebar;
