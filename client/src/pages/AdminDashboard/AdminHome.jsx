import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaUserTie,
  FaDumbbell,
  FaComments,
  FaCreditCard,
  FaExclamationTriangle,
  FaArrowRight,
  FaBolt,
  FaPlus,
  FaChartBar,
  FaHistory
} from "react-icons/fa";
import "../UserDashboard/DashboardStyles.css";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

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
  const [paymentData, setPaymentData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const header = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch Stats
        const overviewRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/overview`, header);
        const paymentsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/payments/admin-payment-report`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Convert cents to dollars for the overview stats if needed
        const totalRevenue = Object.values(paymentsRes.data).reduce((acc, val) => acc + val, 0) / 100;

        setStats({
          members: overviewRes.data.totalUsers,
          trainers: overviewRes.data.totalTrainers,
          sessions: overviewRes.data.totalSessions,
          revenue: `$${totalRevenue.toLocaleString()}`,
          pendingActions: overviewRes.data.pendingActions,
        });

        const labels = Object.keys(paymentsRes.data).sort();
        const dataValues = labels.map(date => paymentsRes.data[date] / 100);

        setPaymentData({
          labels: labels,
          datasets: [
            {
              label: "Revenue (USD)",
              data: dataValues,
              backgroundColor: "rgba(255, 140, 0, 0.6)",
              borderColor: "#ff8c00",
              borderWidth: 2,
              borderRadius: 5,
              maxBarThickness: 35,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const widgets = [
    {
      id: "users",
      title: "Total Members",
      value: stats.members,
      icon: <FaUsers />,
      path: "/admin-dashboard/manage-users",
      color: "blue",
      description: "Active gym members"
    },
    {
      id: "trainers",
      title: "Active Trainers",
      value: stats.trainers,
      icon: <FaUserTie />,
      path: "/admin-dashboard/manage-trainers",
      color: "purple",
      description: "Verified professionals"
    },
    {
      id: "sessions",
      title: "Live Sessions",
      value: stats.sessions,
      icon: <FaDumbbell />,
      path: "/admin-dashboard/admin-manage-sessions",
      color: "orange",
      description: "Available for booking"
    },
    {
      id: "payments",
      title: "Total Revenue",
      value: stats.revenue,
      icon: <FaCreditCard />,
      path: "/admin-dashboard/manage-payments",
      color: "green",
      description: "Successful transactions"
    }
  ];

  const quickActions = [
    { title: "Manage Users", icon: <FaUsers />, path: "/admin-dashboard/manage-users", description: "View and manage all members." },
    { title: "Trainer Requests", icon: <FaUserTie />, path: "/admin-dashboard/manage-trainers", alert: stats.pendingActions > 0, description: "Review and verify applications." },
    { title: "Active Sessions", icon: <FaDumbbell />, path: "/admin-dashboard/admin-manage-sessions", description: "Monitor ongoing gym sessions." },
    { title: "User Feedback", icon: <FaComments />, path: "/admin-dashboard/manage-feedbacks", description: "Check member reviews & ratings." },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard p-4">
      <motion.div
        className="dashboard-header mb-5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-uppercase tracking-wider text-sm text-white-50">System Management</span>
        <h1 className="mt-2 text-white">Admin Dashboard</h1>
        <p className="lead text-white-50">Real-time overview of your fitness ecosystem.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="dashboard-container mb-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {widgets.map((widget) => (
          <motion.div
            key={widget.id}
            className={`dashboard-widget stat-card neon-glow-${widget.color}`}
            variants={itemVariants}
            onClick={() => navigate(widget.path)}
          >
            <div className={`widget-icon text-${widget.color}`}>{widget.icon}</div>
            <div className="mt-3">
              <h1 className="mb-1 text-white">{widget.value}</h1>
              <p className="text-sm m-0 text-white">{widget.title}</p>
              <p className="text-xs text-white-50 m-0">{widget.description}</p>
            </div>
            <div className="widget-footer mt-auto pt-3">
              Details <FaArrowRight className="ms-2" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="row g-4">
        {/* Chart Section */}
        <div className="col-lg-8">
          <motion.div
            className="dashboard-widget p-4 h-100"
            style={{ cursor: 'default' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="m-0 text-white"><FaChartBar className="me-2 text-warning" /> Revenue Performance</h5>
              <span className="text-xs text-white-50">Last 7 Days</span>
            </div>
            <div className="revenue-chart-container" style={{ height: '300px', position: 'relative' }}>
              <Bar
                data={paymentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { mode: 'index', intersect: false }
                  },
                  scales: {
                    x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="col-lg-4">
          <motion.div
            className="management-card p-4 h-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h5 className="mb-4 text-white"><FaBolt className="me-2 text-warning" /> Quick Actions</h5>
            <div className="row g-2">
              {quickActions.map((action, idx) => (
                <div key={idx} className="col-12">
                  <button
                    onClick={() => navigate(action.path)}
                    className="list-group-item list-group-item-action bg-transparent border-white-10 text-white p-3 rounded-3 d-flex align-items-center gap-3 transition-all"
                  >
                    <div className="p-2 rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      {action.icon}
                    </div>
                    <div className="text-start flex-grow-1">
                      <div className="fw-bold d-flex align-items-center gap-2">
                        {action.title}
                        {action.alert && <span className="badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>NEW</span>}
                      </div>
                      <small className="text-white-50 d-block text-xs">{action.description}</small>
                    </div>
                    <FaArrowRight className="text-white-50 opacity-25" style={{ fontSize: '0.8rem' }} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-12">
          <motion.div
            className="management-card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h5 className="mb-3 text-white"><FaExclamationTriangle className="me-2 text-danger" /> Critical Alerts</h5>
            <div className="d-flex flex-wrap gap-3">
              {stats.pendingActions > 0 ? (
                <div className="alert alert-warning bg-warning bg-opacity-10 border-warning border-opacity-25 text-warning p-3 mb-0 rounded-3 flex-grow-1">
                  <span className="fw-bold">{stats.pendingActions}</span> trainers are waiting for your approval.
                  <button className="btn btn-sm btn-link text-warning p-0 ms-2 text-decoration-none fw-bold" onClick={() => navigate('/admin-dashboard/manage-trainers')}>Review Now →</button>
                </div>
              ) : (
                <div className="text-white-50 p-2">No critical alerts at this time. All systems operational.</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
