import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { FaChartLine, FaWallet, FaCalendarDay } from "react-icons/fa";
import { motion } from "framer-motion";
import Chart from "chart.js/auto";

function AdminPayment() {
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/payments/admin-payment-report`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setReport(response.data);
      } catch (error) {
        setError("Failed to load payment report.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const labels = Object.keys(report).sort(); 
  const dataValues = labels.map(date => report[date] / 100); 

  const data = {
    labels: labels, 
    datasets: [
      {
        label: "Daily Revenue ($)",
        data: dataValues, 
        backgroundColor: "rgba(255, 140, 0, 0.6)",
        borderColor: "#ff8c00",
        borderWidth: 2,
        borderRadius: 5,
        hoverBackgroundColor: "rgba(255, 140, 0, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ff8c00',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 140, 0, 0.3)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
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
        <h2 className="text-white mb-2"><FaWallet className="text-warning me-2" /> Financial Overview</h2>
        <p className="text-white-50">Detailed breakdown of daily revenue and transaction trends.</p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="management-card p-4"
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="m-0 text-white"><FaChartLine className="me-2 text-warning" /> Daily Earnings Analysis</h5>
              <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 border border-warning border-opacity-25">
                Total: ${dataValues.reduce((a, b) => a + b, 0).toFixed(2)}
              </span>
            </div>
            
            <div style={{ height: "400px" }}>
              <Bar data={data} options={options} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="row g-4">
        {labels.length === 0 ? (
          <div className="col-12 text-center text-white-50 py-5">No transaction data available for this period.</div>
        ) : (
          labels.slice().reverse().map((date, idx) => (
            <motion.div 
              key={date}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div className="management-card p-3 text-center border-white-10">
                <div className="text-white-50 text-xs text-uppercase mb-2 d-flex align-items-center justify-content-center gap-1">
                  <FaCalendarDay /> {new Date(date).toLocaleDateString()}
                </div>
                <h4 className="text-white m-0">${(report[date] / 100).toFixed(2)}</h4>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPayment;
