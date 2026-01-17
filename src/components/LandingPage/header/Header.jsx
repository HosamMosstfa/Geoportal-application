

import headerBg from "../../../assets/HeaderAndLogo/Header.png";
import logo from "../../../assets/HeaderAndLogo/Logo Dark mode.png";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="header-wrapper"
      style={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="logos-section">
        <img
          src={logo}
          alt="Logo"
          className="header-logo"
          onClick={() => navigate("/")}
        />
      </div>

    </div>
  );
};

export default Header;
