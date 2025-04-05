import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardStyles.css";
import UpcomingSessions from "./HomeUpcomingsessions";
import UserGoalsWidget from "./HomeGoal";

import sessionbg from "../../assets/anastase-maragos-9dzWZQWZMdE-unsplash.jpg"
import trainingbg from "../../assets/240_F_538576949_2MaY4QZFTP4ChIuNBlbM97xzecLwS2Un.jpg"
import nutritionbg from "../../assets/istockphoto-1369217533-612x612.webp"
import fitnessbg from "../../assets/240_F_269967154_79LtfDL0RXbErnMLucstEAF64B7e9i86.jpg"
import progressbg from "../../assets/premium_photo-1661604462106-25b406913827.avif"
import HomeProgress from "./HomeProgress";


function Home() {
  const navigate = useNavigate();

  return (
    <div className="user-dashboard">
    <div className="dashboard-container">
      {/* Upcoming Sessions Widget */}
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${sessionbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }}  onClick={() => navigate("/user-dashboard/session")}>
        <h4>Upcoming Sessions</h4>
        <UpcomingSessions viewType="compact" />
      </div>

      {/* Training Widget */}
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${trainingbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'}} 
        onClick={() => navigate("/user-dashboard/training")}>
        <h4> My Training </h4>
      </div>

      {/* Nutrition Widget */}
      <div className="dashboard-widget"style={{ 
        backgroundImage: `url(${nutritionbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'}} 
        onClick={() => navigate("/user-dashboard/nutritions")}>
        <h4>You can’t improve what you don’t track—log your meals now!</h4>
      </div>

      {/* Fitness Goals Widget */}
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${fitnessbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'}}
        onClick={() => navigate("/user-dashboard/goals")}>
        <h4>Fitness Goals</h4>
        <UserGoalsWidget />
      </div>

      {/* Progress Tracking Widget */}
      <div className="dashboard-widget" style={{ 
        backgroundImage: `url(${progressbg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'}} 
        onClick={() => navigate("/user-dashboard/progress")}>
        <h4>Progress Tracking</h4>
        <HomeProgress />
      </div>
    </div>
    </div>
  );
}

export default Home;
