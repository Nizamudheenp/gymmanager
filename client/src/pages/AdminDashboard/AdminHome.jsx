import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaUsers, 
  FaUserTie, 
  FaDumbbell, 
  FaComments, 
  FaCreditCard,
  FaExclamationTriangle,
  FaArrowRight
} from "react-icons/fa";
import "../UserDashboard/DashboardStyles.css";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    totalFeedbacks: 0,
    totalPayments: 0,
    pendingActions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/overview`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setStats(response.data);
      } catch (error) {
        console.error("Error fetching admin overview:", error);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const dashboardItems = [
    {
      id: "users",
      title: `${stats.totalUsers} Registered Users`,
      icon: <FaUsers />,
      path: "/admin-dashboard/manage-users",
      description: "Manage gym members and access account details."
    },
    {
      id: "trainers",
      title: `${stats.totalTrainers} Trainers`,
      icon: <FaUserTie />,
      path: "/admin-dashboard/manage-trainers",
      description: "Oversee the training staff and performance metrics."
    },
    {
      id: "sessions",
      title: `${stats.totalSessions} Total Sessions`,
      icon: <FaDumbbell />,
      path: "/admin-dashboard/admin-manage-sessions",
      description: `${stats.upcomingSessions} upcoming sessions scheduled.`
    },
    {
      id: "feedbacks",
      title: `${stats.totalFeedbacks} Feedbacks`,
      icon: <FaComments />,
      path: "/admin-dashboard/manage-feedbacks",
      description: "Review client and trainer interactions and ratings."
    },
    {
      id: "payments",
      title: `${stats.totalPayments} Payments`,
      icon: <FaCreditCard />,
      path: "/admin-dashboard/manage-payments",
      description: "Monitor system revenue and transition history."
    },
    {
      id: "actions",
      title: `${stats.pendingActions} Alerts`,
      icon: <FaExclamationTriangle />,
      path: "/admin-dashboard/manage-trainers",
      description: "System updates requiring administrative attention."
    }
  ];

  return (
    <div className="admin-dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Admin Control Center</h1>
        <p>Strategic overview and management of the entire gym ecosystem.</p>
      </motion.div>

      <motion.div 
        className="dashboard-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {dashboardItems.map((item) => (
          <motion.div 
            key={item.id}
            className="dashboard-widget"
            variants={itemVariants}
            onClick={() => navigate(item.path)}
          >
            <div className="widget-icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <div className="widget-footer">
              Manage <FaArrowRight style={{ marginLeft: '10px' }} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default AdminHome;
