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
        setTransactions(response.data.sessions || []); 
      } catch (error) {
        console.error("Error fetching earnings:", error);
      }
    };
    fetchEarnings();
  }, [token]);

  return (
    <div className="card p-3 bg-transparent text-white border border-warning">
      <h4>Total Earnings: ${totalEarnings.toFixed(2)}</h4>
      <hr />
      <h6>Recent Transactions</h6>
      <ul className="list-group bg-transparent">
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((tx) => (
            <li key={tx.appointmentId} className="list-group-item bg-transparent text-white border-light">
              {tx.amount} USD - {new Date(tx.date).toLocaleDateString()}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TrainerEarnings;
