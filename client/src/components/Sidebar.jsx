import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaDumbbell, FaAppleAlt , FaComments , FaCalendarCheck , FaChartLine ,FaBullseye, FaBars, FaUsers ,} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/AuthSlice";
import "./Components.css"

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const dispatch = useDispatch();

  const sidebarLinks = {
    user: [
      { path: "/user-dashboard", label: "Home", icon: <FaHome /> },
      { path: "/user-dashboard/training", label: "training", icon: <FaDumbbell /> },
      { path: "/user-dashboard/nutritions", label: "Nutritions", icon: <FaAppleAlt  /> },
      { path: "/user-dashboard/goals", label: "goals", icon: <FaBullseye /> },
      { path: "/user-dashboard/progress", label: "progress", icon: <FaChartLine /> },
      { path: "/user-dashboard/session", label: "sessions", icon: <FaCalendarCheck /> },
      { path: "/user-dashboard/messages", label: "messages", icon: <FaComments /> },
    ],
    trainer: [
      { path: "/trainer-dashboard", label: "Home", icon: <FaHome /> },
      { path: "/trainer-dashboard/manage-sessions", label: "Manage sessions", icon: <FaCalendarCheck /> },
      { path: "/trainer-dashboard/manage-clients", label: "clients", icon: <FaUsers /> },
      { path: "/trainer-dashboard/messages", label: "messages", icon: <FaComments /> },

    ],
    admin: [
      { path: "/admin-dashboard", label: "Home", icon: <FaHome /> },
      { path: "/admin-dashboard/manage-trainers", label: "manage trainers", icon: <FaUsers /> },
      { path: "/admin-dashboard/manage-users", label: "manage users", icon: <FaUsers /> },
      
    ]
  };

  return (
    <>  
    <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <ul className="nav">
          {sidebarLinks[role]?.map((item) => (
            <li key={item.path} className={`sidebar-nav-item ${location.pathname === item.path ? "active" : ""}`}>
              <Link to={item.path} onClick={toggleSidebar}>
                {item.icon} <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button id="sidebar-logoutbtn" className="btn btn-danger" onClick={() => dispatch(logoutUser())}>
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
