import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Container, Spinner, Alert } from "react-bootstrap";
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
  const dataValues = labels.map(date => report[date]); 

  const data = {
    labels: labels, 
    datasets: [
      {
        label: "Daily Earnings (USD)",
        data: dataValues, 
        backgroundColor: "goldenrod",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container className="mt-4">
      <h3 className="text-center text-golden">Daily Payment Overview</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Bar data={data} />
      )}
    </Container>
  );
}

export default AdminPayment;
