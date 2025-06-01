import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaBook,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../assets/logo.webp"; // Adjust path if needed

function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Bright Future Logo" className="sidebar-img" />
        <div>
          <h2>Bright Future</h2>
          <p>Admin Panel</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className="nav-link"
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaHome className="icon" />
          <span>Dashboard</span>
        </button>
        <button
          className="nav-link"
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaUserGraduate className="icon" />
          <span>Students</span>
        </button>
        <button
          className="nav-link"
          onClick={() => navigate("#")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaBook className="icon" />
          <span>Exams</span>
        </button>
        <button
          className="nav-link"
          onClick={() => navigate("#")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaChartBar className="icon" />
          <span>Reports</span>
        </button>
        <button
          className="nav-link"
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaCog className="icon" />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn text-light btn btn-danger"
          onClick={handleLogout}
          style={{
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FaSignOutAlt className="icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
