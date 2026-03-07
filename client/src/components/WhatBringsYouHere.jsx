import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Components.css";

function WhatBringsYouHere() {
  const navigate = useNavigate();

  const selectionCards = [
    {
      title: "I want to get fit",
      description: "Track your workouts, set goals, and transform your lifestyle.",
      path: "/register/user",
      icon: "💪",
      color: "#ff8c00"
    },
    {
      title: "I am a Trainer",
      description: "Manage your clients, sessions, and build your professional brand.",
      path: "/register/trainer",
      icon: "🏋️‍♂️",
      color: "#ff8c00"
    }
  ];

  return (
    <div className="selection-page-container">
      <motion.div
        className="back-to-home-btn"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ x: -5 }}
        onClick={() => navigate("/")}
      >
        <i className="fas fa-chevron-left"></i>
        <span>Back to Home</span>
      </motion.div>

      <div className="selection-content">
        <motion.div
          className="selection-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>What Brings You <span>Here?</span></h1>
          <p>Choose your path and let's start your journey together.</p>
        </motion.div>

        <div className="selection-grid">
          {selectionCards.map((card, index) => (
            <motion.div
              key={index}
              className="selection-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 40px rgba(255, 140, 0, 0.15)",
                borderColor: "rgba(255, 140, 0, 0.4)"
              }}
              onClick={() => navigate(card.path)}
            >
              <div className="card-icon">{card.icon}</div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <div className="card-action">
                <span>Select & Continue</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="back-to-login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
        </motion.div>
      </div>
    </div>
  );
}

export default WhatBringsYouHere;
