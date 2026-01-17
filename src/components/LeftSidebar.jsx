import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

function LeftSidebar() {
  /* ---------- Dummy Data ---------- */

  // Elevation distribution data (matching the chart)
  const elevationData = [
    { name: '346 م', value: 50 },
    { name: '426 م', value: 25 },
    { name: '534 م', value: 13 },
    { name: '678 م', value: 8 },
    { name: '981 م', value: 5 },
  ];

  // Slope angle distribution data (matching the chart)
  const slopeData = [
    { name: '1.7°', value: 41 },
    { name: '3.4°', value: 0.5 },
    { name: '5.7°', value: 5 },
    { name: '8.5°', value: 1 },
    { name: '11.3°', value: 4 },
    { name: '14°', value: 12 },
    { name: '16.7°', value: 2 },
    { name: '21.8°', value: 6 },
    { name: '30.9°', value: 15 },
    { name: '45°', value: 13 },
    { name: '90°', value: 1 },
  ];

  /* ---------- Stats ---------- */

  const stats = [
    { title: "عدد العينات", value: 7 },
    { title: "عدد المحطات", value: 506 },
    { title: "عدد المناطق الحرجة", value: 1 },
  ];

  /* ---------- Styles using CSS Variables ---------- */
  const cardStyle = {
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    padding: "10px",
    background: "var(--bg-card-gradient)",
    textAlign: "center",
    marginBottom: "10px",
    boxShadow: "var(--shadow-card)",
  };

  const cardTitle = {
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginBottom: "5px",
  };

  const cardValue = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "var(--text-primary)",
  };

  return (
    <div
      style={{
        padding: "12px",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        background: "transparent",
        color: "var(--text-primary)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <h3 style={{ marginBottom: "12px", fontSize: "16px", textAlign: "center" }}>تحليلات</h3>

      {/* ---------- Number Cards ---------- */}
      <div style={{ marginBottom: "20px" }}>
        {stats.map((item, index) => (
          <div key={index} style={cardStyle}>
            <div style={cardTitle}>{item.title}</div>
            <div style={cardValue}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* ---------- Bar Chart ---------- */}
      <div style={{ marginBottom: "18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h4 style={{ fontSize: "14px", marginBottom: "8px", textAlign: "center" }}>توزيع الارتفاعات (%)</h4>
        <BarChart width={235} height={180} data={elevationData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={45} stroke="var(--text-primary)" />
          <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} width={35} stroke="var(--text-primary)" />
          <Tooltip formatter={(value) => `${value}%`} contentStyle={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }} />
          <Bar dataKey="value" fill="var(--chart-bar)" name="النسبة المئوية" />
        </BarChart>
      </div>

      {/* ---------- Line Chart ---------- */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h4 style={{ fontSize: "14px", marginBottom: "8px", textAlign: "center" }}>توزيع زاوية الانحدار (%)</h4>
        <LineChart width={235} height={180} data={slopeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="name" tick={{ fontSize: 8 }} interval={0} angle={-45} textAnchor="end" height={55} stroke="var(--text-primary)" />
          <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} width={35} stroke="var(--text-primary)" />
          <Tooltip formatter={(value) => `${value}%`} contentStyle={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }} />
          <Line type="monotone" dataKey="value" stroke="var(--chart-line)" name="نسبة المساحة" dot={{ r: 3 }} />
        </LineChart>
      </div>
    </div>
  );
}

export default LeftSidebar;
