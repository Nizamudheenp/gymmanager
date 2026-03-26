import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTrash, FaStar, FaQuoteLeft, FaCalendarAlt, FaChartPie } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

function ManageFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getfeedbacks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load feedbacks.");
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [token]);

  const deleteFeedback = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/delete-feedback/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(prev => prev.filter(f => f._id !== reviewId));
      toast.success("Feedback deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete feedback.");
    }
  };

  // Prepare Chart Data
  const ratingsCount = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars
  feedbacks.forEach(f => {
    if (f.rating >= 1 && f.rating <= 5) ratingsCount[f.rating - 1]++;
  });

  const chartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [{
      data: ratingsCount,
      backgroundColor: [
        "#ff4d4d", "#ffa64d", "#ffff4d", "#a6ff4d", "#4dff4d"
      ],
      borderWidth: 0,
    }]
  };

  if (loading) {
     return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
  }

  return (
    <div className="container py-5">
      <div className="dashboard-header mb-5 p-0">
        <h2 className="text-white mb-2" style={{ display: "inline-block", background: "linear-gradient(135deg, #fff 30%, #ff8c00 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Feedback Management</h2>
        <p className="text-white-50">Monitor and maintain overall service quality.</p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-4">
          <div className="management-card p-4 h-100 text-center">
            <h5 className="mb-4 d-flex align-items-center justify-content-center gap-2 text-white">
              <FaChartPie className="text-info" /> Rating Distribution
            </h5>
            <div style={{ height: "200px" }}>
              <Pie 
                data={chartData} 
                options={{ 
                  plugins: { legend: { position: 'bottom', labels: { color: '#fff', boxWidth: 12 } } },
                  maintainAspectRatio: false 
                }} 
              />
            </div>
          </div>
        </div>
        <div className="col-lg-8">
           <div className="management-card p-4 h-100 d-flex flex-column justify-content-center">
              <div className="row text-center">
                <div className="col-4 border-end border-white-10">
                  <h3 className="text-white mb-1">{feedbacks.length}</h3>
                  <small className="text-white-50 text-uppercase">Total Reviews</small>
                </div>
                <div className="col-4 border-end border-white-10">
                  <h3 className="text-white mb-1">
                    {(feedbacks.reduce((acc, f) => acc + f.rating, 0) / (feedbacks.length || 1)).toFixed(1)}
                  </h3>
                  <small className="text-white-50 text-uppercase">Avg Rating</small>
                </div>
                <div className="col-4">
                  <h3 className="text-white mb-1">
                    {feedbacks.filter(f => f.rating >= 4).length}
                  </h3>
                  <small className="text-white-50 text-uppercase">Positive (4+★)</small>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="row g-4">
        <AnimatePresence>
          {feedbacks.map((feedback, idx) => (
            <motion.div 
              key={feedback._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className="col-12 col-md-6"
            >
              <div className="management-card p-4 h-100 position-relative overflow-hidden">
                <FaQuoteLeft className="position-absolute text-white-50 opacity-05" style={{ top: '10px', right: '10px', fontSize: '3rem' }} />
                
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < feedback.rating ? "text-warning" : "text-white-50 opacity-25"} />
                    ))}
                  </div>
                  <button 
                    onClick={() => deleteFeedback(feedback._id)}
                    className="btn btn-sm btn-outline-danger border-0 p-1"
                  >
                    <FaTrash />
                  </button>
                </div>

                <p className="text-white mb-4 fst-italic">"{feedback.comment}"</p>

                <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top border-white-10">
                  <div className="d-flex align-items-center gap-2">
                    <div className="user-avatar" style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                        {feedback.username.charAt(0)}
                    </div>
                    <span className="text-white text-sm">{feedback.username}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ManageFeedbacks;
