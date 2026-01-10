function Navbar({ theme, onToggleTheme }) {

  const light = theme === "light";
  const bg = light
    ? "linear-gradient(180deg,#ffffff,#f7f9fb)"
    : "linear-gradient(180deg, rgba(6,86,147,0.95), rgba(2,54,106,0.95))";
  const textColor = light ? "#0b2b44" : "#fff";
const marqueeStyle = `
  @keyframes marquee-light {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }

  @keyframes marquee-dark {
    0% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

  return (
    <>
      <style>{marqueeStyle}</style>
      <nav
      className="navbar fixed-top"
      style={{
        height: "64px",
        padding: "8px 16px",
        background: bg,
        color: textColor,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: light ? "0 6px 18px rgba(10,20,30,0.06)" : "0 6px 24px rgba(2,30,60,0.25)",
        transition: "all 0.26s cubic-bezier(.2,.9,.2,1)",
      }}
    >
      <div className="container-fluid d-flex align-items-center">

        {/* Left Logo */}
        <div className="d-flex align-items-center" style={{ gap: 12 }}>
          <img
            src="/logo-left.png"
            alt="Left Logo"
            style={{ height: "36px", width: "auto", borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          />
        </div>

        {/* Center Text */}
     <div
  className="mx-auto fw-bold"
  style={{
    pointerEvents: "none",
    fontSize: "20px",
    letterSpacing: "0.3px",
    textAlign: "center",
    maxWidth: 960,
    overflow: "hidden",
    whiteSpace: "nowrap",
    position: "relative",
    color: light ? "#0b2b44" : "#ffffff",
  }}
>
  <span
    style={{
      position: "relative",
      zIndex: 1,
    }}
  >
    مشروع تقييم مخاطر المنحدرات والانهيارات الصخرية بالمشاعر المقدسة وحماها وتدابير الحماية الهندسية
  </span>

  {/* اللمعة */}
  <span
    style={{
      position: "absolute",
      inset: 0,
      background: light
        ? "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)"
        : "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.9) 50%, transparent 70%)",
      animation: "shine 3s infinite",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      pointerEvents: "none",
    }}
  >
    مشروع تقييم مخاطر المنحدرات والانهيارات الصخرية بالمشاعر المقدسة وحماها وتدابير الحماية الهندسية
  </span>
</div>


        {/* Right: theme toggle + logo */}
        <div className="d-flex align-items-center" style={{ gap: 12 }}>
          <button
            onClick={onToggleTheme}
            title="Toggle theme"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "none",
              background: light ? "linear-gradient(180deg,#fff,#eef6fb)" : "linear-gradient(180deg,#1f3040,#12202a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}
          >
            {light ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42z" fill="#f6c358"/>
                <path d="M1 13h3v-2H1v2z" fill="#f6c358"/>
                <path d="M11 1h2v3h-2V1z" fill="#f6c358"/>
                <path d="M16.24 4.84l1.42 1.42 1.79-1.8-1.41-1.41-1.8 1.79z" fill="#f6c358"/>
                <path d="M20 11v2h3v-2h-3z" fill="#f6c358"/>
                <path d="M11 20h2v3h-2v-3z" fill="#f6c358"/>
                <circle cx="12" cy="12" r="3" fill="#f6c358" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#fff"/>
              </svg>
            )}
          </button>

          <img
            src="/logo-right.png"
            alt="Right Logo"
            style={{ height: "36px", width: "90px", borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          />
        </div>

      </div>
    </nav>
    </>
  );
}

export default Navbar;
