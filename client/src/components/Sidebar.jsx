import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaDumbbell, FaClipboardList, FaUsers, FaBars } from "react-icons/fa";
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
      { path: "/user-dashboard/nutritions", label: "Nutritions", icon: <FaClipboardList /> },
      { path: "/user-dashboard/goals", label: "goals", icon: <FaClipboardList /> },
      { path: "/user-dashboard/progress", label: "progress", icon: <FaClipboardList /> },
      { path: "/user-dashboard/session", label: "sessions", icon: <FaClipboardList /> },
      { path: "/user-dashboard/messages", label: "messages", icon: <FaClipboardList /> },
    ],
    trainer: [
      { path: "/trainer-dashboard", label: "Home", icon: <FaHome /> },
      { path: "/trainer-dashboard/manage-sessions", label: "Manage sessions", icon: <FaDumbbell /> },
      { path: "/trainer-dashboard/manage-clients", label: "clients", icon: <FaDumbbell /> },
      { path: "/trainer-dashboard/messages", label: "messages", icon: <FaClipboardList /> },

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
