import React, { useEffect, useState } from "react";
import axios from "axios";

function TrainerEarnings() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/payments/trainer-earnings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTotalEarnings(response.data.totalEarnings);
        setTransactions(response.data.sessions.reverse() || []);
      } catch (error) {
        console.error("Error fetching earnings:", error);
      }
    };
    fetchEarnings();
  }, [token]);

  return (
    <div className="w-100" style={{ textAlign: "left" }}>
      <div className="mb-3">
        <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem" }}>Total Revenue</div>
        <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "700" }}>${(totalEarnings / 100).toFixed(2)}</div>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "15px" }}>
        <h6 style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.9rem", fontWeight: "600", marginBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px" }}>
          Recent Transactions
        </h6>
        <div className="d-flex flex-column gap-2">
          {transactions.length === 0 ? (
            <p className="mb-0" style={{ opacity: 0.5, fontSize: "0.85rem" }}>No transactions found.</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx.appointmentId} className="d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>{new Date(tx.date).toLocaleDateString()}</span>
                <span style={{ color: "#28a745", fontWeight: "600" }}>+ ${(tx.amount / 100).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TrainerEarnings;
