import React from "react";
import { useNavigate } from "react-router-dom";
import "../UserDashboard/DashboardStyles.css";

import earningsbg from "../../assets/anastase-maragos-9dzWZQWZMdE-unsplash.jpg"
import sessionsbg from "../../assets/240_F_538576949_2MaY4QZFTP4ChIuNBlbM97xzecLwS2Un.jpg"
import clientsbg from "../../assets/istockphoto-1369217533-612x612.webp"
import feedbackbg from "../../assets/240_F_269967154_79LtfDL0RXbErnMLucstEAF64B7e9i86.jpg"
import actionsbg from "../../assets/premium_photo-1661604462106-25b406913827.avif"
import PendingAppointments from "./PendingAppointments";
import UpcomingSessionWidget from "./UpcomingMySession";
import ClientProgressOverview from "./ClientProgressOverView";
import TrainerEarnings from "./TrainerEarnings";
import HomeReviewWidget from "./HomeMyReviews";

function TrainerHome() {
  const navigate = useNavigate();

  return (
    <div className="trainer-dashboard">
    <div className="dashboard-container">
      {/* Earnings Overview Widget */}
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${earningsbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} > 
        <h4>Earnings Overview</h4>
        <TrainerEarnings />
      </div>

      {/* Upcoming Sessions Widget */}
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${sessionsbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} onClick={() => navigate("/trainer-dashboard/manage-sessions")}> 
        <h4>Upcoming Sessions</h4>
        <UpcomingSessionWidget />
      </div>

      {/* Client Progress Widget */}
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${clientsbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} onClick={() => navigate("/trainer-dashboard/manage-clients")}> 
        <h4>Client Progress</h4>
        <ClientProgressOverview />
      </div>

      {/* Feedback & Reviews Widget */}
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${feedbackbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} onClick={() => navigate("/trainer-dashboard/feedback")}> 
        <h4>Feedback & Reviews</h4>
        <HomeReviewWidget />
      </div>

      {/* Quick Actions Widget */}
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${actionsbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }} onClick={() => navigate("/trainer-dashboard/manage-sessions")}> 
        <h4>session bookings</h4>
        <PendingAppointments />
      </div>
    </div>
    </div>
  );
}

export default TrainerHome;
