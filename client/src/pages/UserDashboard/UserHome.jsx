import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaDumbbell, 
  FaUtensils, 
  FaBullseye, 
  FaChartLine,
  FaArrowRight
} from "react-icons/fa";
import "./DashboardStyles.css";
import UpcomingSessions from "./HomeUpcomingsessions";
import UserGoalsWidget from "./HomeGoal";
import HomeProgress from "./HomeProgress";

function Home() {
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
      id: "sessions",
      title: "Upcoming Sessions",
      icon: <FaCalendarAlt />,
      component: <UpcomingSessions viewType="compact" />,
      path: "/user-dashboard/session",
      description: "Stay updated with your scheduled training."
    },
    {
      id: "training",
      title: "My Training",
      icon: <FaDumbbell />,
      path: "/user-dashboard/training",
      description: "Access your personalized workout regime."
    },
    {
      id: "nutrition",
      title: "Nutrition Log",
      icon: <FaUtensils />,
      path: "/user-dashboard/nutritions",
      description: "Log your daily meals and track intake."
    },
    {
      id: "goals",
      title: "Fitness Goals",
      icon: <FaBullseye />,
      component: <UserGoalsWidget />,
      path: "/user-dashboard/goals",
      description: "Manage your personal fitness milestones."
    }
  ];

  return (
    <div className="user-dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ display: "inline-block", background: "linear-gradient(135deg, #fff 30%, #ff8c00 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>User Dashboard</h1>
        <p>Your journey to fitness starts here. Track your progress and stay consistent.</p>
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
            {item.component && <div className="widget-content">{item.component}</div>}
            <div className="widget-footer">
              Explore <FaArrowRight style={{ marginLeft: '10px' }} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full-width Progress Tracking Section */}
      <motion.div 
        className="full-width-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="dashboard-widget" style={{ minHeight: 'auto', width: '100%' }} onClick={() => navigate("/user-dashboard/progress")}>
          <div className="d-flex justify-content-between align-items-center w-100 mb-4">
            <div>
              <div className="widget-icon mb-0"><FaChartLine /></div>
              <h4 className="mb-0">Progress Analytics</h4>
              <p className="mb-0">A detailed look at your transformation journey over time.</p>
            </div>
            <div className="widget-footer" style={{ opacity: 1, transform: 'none' }}>
              Full Report <FaArrowRight style={{ marginLeft: '10px' }} />
            </div>
          </div>
          <div className="w-100">
            <HomeProgress />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
