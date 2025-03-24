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
           setProgress(sortedResponse.slice(0,2));
          } catch (err) {
            console.error("Error fetching progress:", err.response?.data?.message || err.message);
          }
        };
        fetchProgress();
      }, []);

  return (
    <div>
   
    <div style={{ height: "250px", width: "100%" }}>
      <ProgressChart progress={progress} />
    </div>
  </div>
  )
}

export default HomeProgress