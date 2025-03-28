import React from "react";
import { useNavigate } from "react-router-dom";
import "../UserDashboard/DashboardStyles.css";
import { useEffect, useState } from "react";
import axios from "axios";

import userbg from "../../assets/anastase-maragos-9dzWZQWZMdE-unsplash.jpg"
import trainerbg from "../../assets/240_F_538576949_2MaY4QZFTP4ChIuNBlbM97xzecLwS2Un.jpg"
import sessionbg from "../../assets/istockphoto-1369217533-612x612.webp"
import feedbackbg from "../../assets/240_F_269967154_79LtfDL0RXbErnMLucstEAF64B7e9i86.jpg";
import paymentsbg from "../../assets/anastase-maragos-9dzWZQWZMdE-unsplash.jpg";
import actionsbg from "../../assets/premium_photo-1661604462106-25b406913827.avif";

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


  return (
    <div className="dashboard-container">
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${userbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }}onClick={() => navigate("/admin-dashboard/manage-users")} > 
        <h4>{stats.totalUsers} users</h4>
      </div>

      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${trainerbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} onClick={() => navigate("/admin-dashboard/manage-trainers")}> 
        <h4>{stats.totalTrainers} trainers</h4>
      </div>

      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${sessionbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} onClick={() => navigate("/admin-dashboard/admin-manage-sessions")}> 
        <h4>{stats.totalSessions} sessions</h4>
        <h4>{stats.upcomingSessions} upcoming sessions</h4>
      </div>

      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${feedbackbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} onClick={() => navigate("/admin-dashboard/manage-feedbacks")}> 
        <h4>{stats.totalFeedbacks} Feedbacks</h4>
      </div>

      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${paymentsbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} onClick={() => navigate("/admin-dashboard/manage-payments")}> 
        <h4>{stats.totalPayments} Payments</h4>
      </div>

      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${actionsbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} onClick={() => navigate("/admin-dashboard/manage-trainers")}> 
         <h4>{stats.pendingActions} Pending Actions</h4>
      </div>


    </div>
  );
}

export default AdminHome;
