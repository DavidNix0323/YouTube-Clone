import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import menu_icon from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search.png";
import upload_icon from "../../assets/upload.png";
import more_icon from "../../assets/more.png";
import notification_icon from "../../assets/notification.png";
import jack_img from "../../assets/jack.png";

const Navbar = ({ setSidebar, searchTerm, setSearchTerm, theme, toggleTheme }) => {
  const navigate = useNavigate();

  const sidebar_toggle = () => {
    setSidebar((prev) => !prev);
  };

  const handleSearch = () => {
    // Just trigger local filtering—no navigation
    console.log("Search triggered:", searchTerm);
  };
  

  return (
    <nav className="flex-div">
      <div className="nav-left flex-div">
        <img src={menu_icon} alt="menu" className="menu-icon" onClick={sidebar_toggle} />
        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>
      </div>

      <div className="nav-middle flex-div">
        <div className="search-box flex-div">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            <img src={search_icon} alt="search" />
          </button>
        </div>
      </div>

      <div className="nav-right flex-div">
      <button
  onClick={toggleTheme}
  className="theme-toggle"
  aria-label="Toggle theme"
  title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
>
  {theme === "light" ? "🌙 Dark Theme" : "🌞 Light Theme"}
</button>


<div className="upload-disabled" title="Upload is disabled">
  <img src={upload_icon} alt="upload" />
</div>

        <img src={more_icon} alt="more" />
        <img src={notification_icon} alt="notifications" />
        <img src={jack_img} alt="user" className="user-icon" />
      </div>
    </nav>
  );
};

export default Navbar;
