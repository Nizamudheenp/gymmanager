import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ProgressChart from './ProgressChart';

function HomeProgress() {
    const [progress,setProgress]= useState([])
    const token = localStorage.getItem("token")


      useEffect(() => {
        const fetchProgress = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/user/getprogress`,
              { headers: { Authorization: `Bearer ${token}` } }
            );        
            const sortedResponse = response.data.progress.sort((a,b)=> new Date(b.loggedAt) - new Date(a.loggedAt))
            setProgress(sortedResponse.slice(0,15));
          } catch (err) {
            console.error("Error fetching progress:", err.response?.data?.message || err.message);
          }
        };
        fetchProgress();
      }, [token]);

  const sortedFull = [...progress].sort((a, b) => new Date(a.loggedAt) - new Date(b.loggedAt));
  const startWeight = sortedFull.length > 0 ? sortedFull[0].weight : 0;
  const currentWeight = sortedFull.length > 0 ? sortedFull[sortedFull.length - 1].weight : 0;
  const weightChange = (currentWeight - startWeight).toFixed(1);

  return (
    <div className="w-100">
      {/* Stats Header */}
      <div className="d-flex flex-wrap gap-3 mb-4 pt-2">
        <div style={{ flex: "1", minWidth: "120px", background: "rgba(255, 255, 255, 0.03)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ fontSize: "0.75rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Starting</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#fff" }}>{startWeight} <small style={{ fontWeight: "400", opacity: 0.6, fontSize: "0.8rem" }}>kg</small></div>
        </div>
        
        <div style={{ flex: "1", minWidth: "120px", background: "rgba(255, 140, 0, 0.08)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255, 140, 0, 0.2)" }}>
          <div style={{ fontSize: "0.75rem", color: "#ff8c00", opacity: 0.8, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Current</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#fff" }}>{currentWeight} <small style={{ fontWeight: "400", opacity: 0.6, fontSize: "0.8rem" }}>kg</small></div>
        </div>

        <div style={{ flex: "1", minWidth: "120px", background: "rgba(255, 255, 255, 0.03)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ fontSize: "0.75rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Progress</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "700", color: weightChange <= 0 ? "#28a745" : "#dc3545" }}>
            {weightChange > 0 ? `+${weightChange}` : weightChange} <small style={{ fontWeight: "400", opacity: 0.6, fontSize: "0.8rem" }}>kg</small>
          </div>
        </div>
      </div>

      {/* Responsive Chart Container */}
      <div 
        style={{ 
          height: "300px", 
          width: "100%",
          position: "relative"
        }}
        className="progress-chart-container"
      >
        <style>
          {`
            @media (min-width: 768px) {
              .progress-chart-container { height: 400px !important; }
            }
          `}
        </style>
        <ProgressChart progress={progress} />
      </div>
    </div>
  );
}

export default HomeProgress