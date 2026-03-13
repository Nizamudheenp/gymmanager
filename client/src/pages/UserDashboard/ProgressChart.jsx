import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  Tooltip, 
  Legend,
  Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const ProgressChart = ({ progress }) => {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.ctx;
      const g = ctx.createLinearGradient(0, 0, 0, 300);
      g.addColorStop(0, "rgba(255, 140, 0, 0.5)");
      g.addColorStop(1, "rgba(255, 140, 0, 0)");
      setGradient(g);
    }
  }, [progress]);

  if (!progress || progress.length === 0) {
    return (
      <div className="text-center p-5" style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "15px", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
        <p className="mb-0" style={{ opacity: 0.5 }}>No transformation data yet. Start logging your progress!</p>
      </div>
    );
  }
  
  const sortedProgress = [...progress].sort((a, b) => new Date(a.loggedAt) - new Date(b.loggedAt));
  const labels = sortedProgress.map(entry => new Date(entry.loggedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }));
  const weightData = sortedProgress.map(entry => entry.weight);

  const data = {
    labels,
    datasets: [
      {
        label: "Weight",
        data: weightData,
        borderColor: "#ff8c00",
        backgroundColor: gradient || "rgba(255, 140, 0, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#ff8c00",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#ff8c00",
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Cleaner look without BMI
      },
      tooltip: {
        backgroundColor: "rgba(10, 10, 10, 0.95)",
        titleFont: { size: 12, weight: '700' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        borderColor: "rgba(255, 140, 0, 0.3)",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y} kg`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          color: "rgba(255, 255, 255, 0.3)", 
          font: { size: 9 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7
        }
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        beginAtZero: false,
        ticks: { 
          color: "rgba(255, 255, 255, 0.3)", 
          font: { size: 9 },
          callback: (value) => value + 'kg'
        }
      },
    }
  };

  return (
    <div className="chart-wrapper" style={{ height: "100%", width: "100%" }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default ProgressChart;
