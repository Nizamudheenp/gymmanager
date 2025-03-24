import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ProgressChart = ({ progress }) => {
  const sortedProgress = progress
    .sort((a, b) => new Date(a.loggedAt) - new Date(b.loggedAt))
    .slice(-5);
  const labels = sortedProgress.map(entry => new Date(entry.loggedAt).toLocaleDateString());

  const weightData = sortedProgress.map(entry => entry.weight);
  const bmiData = sortedProgress.map(entry => entry.bmi);

  const data = {
    labels,
    datasets: [
      {
        label: "Weight (kg)",
        data: weightData,
        borderColor: "green",
        backgroundColor: "rgba(19, 86, 13, 0.2)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "BMI",
        data: bmiData,
        borderColor: "orange",
        backgroundColor: "rgba(163, 111, 14, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 3,
    plugins: {
      legend: {
        labels: {
          color: "white", 
        },
        position: "right",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Date", color: "white" }, 
        ticks: { color: "white" }, 
        grid: { color: "rgba(255, 255, 255, 0)" },
      },
      y: {
        title: { display: true, text: "Value", color: "white" }, 
        ticks: { color: "white" }, 
        grid: { color: "rgba(255, 255, 255, 0.65)" }, 
      },
    }
  };

  return <div style={{ width: "100%", height: "230px",width:"500px" }}> 
  <Line data={data} options={options} />
</div>
};

export default ProgressChart;
