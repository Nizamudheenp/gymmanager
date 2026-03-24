import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarCheck, FaUserFriends } from "react-icons/fa";
import "../UserDashboard/DashboardStyles.css";

function ClientSession() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to clients by default if at the base path
  useEffect(() => {
    if (location.pathname === "/trainer-dashboard/manage-clients") {
      navigate("clients", { replace: true });
    }
  }, [location, navigate]);

  const tabs = [
    { id: "clients", label: "My Clients", icon: <FaUserFriends />, path: "clients" },
    { id: "appointments", label: "Pending Requests", icon: <FaCalendarCheck />, path: "appointments" },
  ];

  return (
    <div className="trainer-dashboard-container p-0 mt-5">
      <div className="dashboard-header-modern mb-4 p-4 pb-0 bg-dark-deep border-bottom border-white-10">
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
          <div>
            <h2 className="text-white fw-bold mb-1">Client Control Center</h2>
            <p className="text-white-50 small mb-4">Monitor leads and manage active training relationships.</p>
          </div>
        </div>

        <nav className="d-flex gap-4">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `nav-tab-item pb-3 text-decoration-none d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`
              }
            >
              {tab.icon}
              <span>{tab.label}</span>
              {location.pathname.includes(tab.path) && (
                <motion.div
                  layoutId="activeTab"
                  className="active-tab-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="content-area p-4 pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .bg-dark-deep { background: rgba(10, 10, 10, 0.4); backdrop-filter: blur(10px); }
        .nav-tab-item {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
          font-size: 1rem;
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-tab-item:hover { color: rgba(255, 255, 255, 0.8); }
        .nav-tab-item.active { color: #ff8c00; text-shadow: 0 0 10px rgba(255, 140, 0, 0.3); }
        .active-tab-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #ff8c00;
          box-shadow: 0 0 10px rgba(255, 140, 0, 0.5);
          border-radius: 3px 3px 0 0;
        }
        .border-white-10 { border-color: rgba(255, 255, 255, 0.05) !important; }
      `}</style>
    </div>
  );
}

export default ClientSession;
