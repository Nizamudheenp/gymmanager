import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaUsers,
  FaCalendarCheck,
  FaStar,
  FaClock,
  FaArrowRight
} from "react-icons/fa";
import "../UserDashboard/DashboardStyles.css";
import PendingAppointments from "./PendingAppointments";
import UpcomingSessionWidget from "./UpcomingMySession";
import ClientProgressOverview from "./ClientProgressOverView";
import TrainerEarnings from "./TrainerEarnings";
import HomeReviewWidget from "./HomeMyReviews";

function TrainerHome() {
  const navigate = useNavigate();

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
      id: "earnings",
      title: "Earnings Overview",
      icon: <FaMoneyBillWave />,
      component: <TrainerEarnings />,
      path: "",
      description: "Manage your professional revenue and earnings."
    },
    {
      id: "sessions",
      title: "Upcoming Sessions",
      icon: <FaCalendarCheck />,
      component: <UpcomingSessionWidget />,
      path: "/trainer-dashboard/manage-sessions",
      description: "Stay updated with your training schedule."
    },
    {
      id: "clients",
      title: "Client Progress",
      icon: <FaUsers />,
      component: <ClientProgressOverview />,
      path: "/trainer-dashboard/manage-clients",
      description: "Monitor client performance and transformation."
    },
    {
      id: "feedback",
      title: "Feedback & Reviews",
      icon: <FaStar />,
      component: <HomeReviewWidget />,
      path: "/trainer-dashboard/myreviews",
      description: "Review your latest ratings and feedback."
    },
    {
      id: "bookings",
      title: "Session Bookings",
      icon: <FaClock />,
      component: <PendingAppointments />,
      path: "/trainer-dashboard/manage-sessions",
      description: "Manage and approve upcoming training requests."
    }
  ];

  return (
    <div className="trainer-dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ display: "inline-block", background: "linear-gradient(135deg, #fff 30%, #ff8c00 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Trainer Dashboard</h1>
        <p>Professional management for professional trainers.</p>
      </motion.div>

      <motion.div
        className="dashboard-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {dashboardItems.filter(item => item.id !== "clients").map((item) => (
          <motion.div
            key={item.id}
            className="dashboard-widget"
            variants={itemVariants}
            onClick={() => navigate(item.path)}
          >
            <div className="widget-icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            {item.component && <div style={{ width: '100%', marginBottom: '15px' }}>{item.component}</div>}
            <div className="widget-footer">
              Manage <FaArrowRight style={{ marginLeft: '10px' }} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full Width Section for Client Progress */}
      <motion.div
        className="full-width-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="dashboard-widget" style={{ cursor: 'default', minHeight: 'auto' }} onClick={(e) => e.stopPropagation()}>
          <div className="widget-icon"><FaUsers /></div>
          <h4>Analytics & Client Progress</h4>
          <ClientProgressOverview />
          <div
            className="widget-footer opacity-100 mt-4"
            style={{ opacity: 1, transform: 'none', cursor: 'pointer' }}
            onClick={() => navigate("/trainer-dashboard/manage-clients")}
          >
            View Detailed Client Management <FaArrowRight style={{ marginLeft: '10px' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TrainerHome;
