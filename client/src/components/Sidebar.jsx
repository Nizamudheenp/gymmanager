import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaDumbbell, FaClipboardList, FaUsers, FaBars } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/AuthSlice";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const dispatch = useDispatch();

  const sidebarLinks = {
    user: [
      { path: "/user-dashboard", label: "Home", icon: <FaHome /> },
      { path: "/user-dashboard/workouts", label: "Workouts", icon: <FaDumbbell /> },
      { path: "/user-dashboard/nutrition", label: "Nutrition", icon: <FaClipboardList /> },
    ],
    trainer: [
      { path: "/trainer-dashboard", label: "Home", icon: <FaHome /> },
      { path: "/trainer-dashboard/manage-sessions", label: "Manage sessions", icon: <FaDumbbell /> },
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
        <ul className="nav flex-column">
          {isOpen &&
            sidebarLinks[role]?.map((item) => (
              <li key={item.path} className={`nav-item ${location.pathname === item.path ? "active" : ""}`}>
                <Link to={item.path} className="nav-link">
                  {item.icon} <span>{item.label}</span>
                </Link>
              </li>
            ))}
        </ul>

        {isOpen && (
          <button className="btn btn-danger w-100 mt-3" onClick={() => dispatch(logoutUser())}>
            Logout
          </button>
        )}
      </div>
    </>
  );
}

export default Sidebar;
