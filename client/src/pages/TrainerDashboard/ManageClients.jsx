import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/getbookings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClients(response.data.appointments || []);
    } catch (error) {
      setError("Failed to fetch clients.");
      setClients([]);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchClients();
  }, [token]);

  const removeClient = async (userId) =>{
    try {
      
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/trainer/removeclient/${userId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
     );
     console.log("Removing client with userId:", userId);

     setClients((prevClients) => prevClients.filter((client) => client.userId._id !== userId));
    } catch (error) {
      console.error("API request failed:", error.message);
      
    }
  }

  return (
    <div className="container mt-4">
      <h4>My Clients</h4>
      {loading && <p>Loading clients...</p>}
      {error && <p className="text-danger">{error}</p>}

      {clients.filter((client) => client.status === "confirmed").length === 0 ? (
        <p>No confirmed clients yet.</p>
      ) : (
        <div className="row">
          {clients
            .filter((client) => client.status === "confirmed")
            .map((client) => (
              <div key={client._id} className="col-md-4 mb-4">
                <div className="card shadow-sm p-3">
                  <h5>{client.userId.username}</h5>
                  <p>{client.userId.email}</p>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/trainer-dashboard/manage-workouts/${client.userId._id}`)}
                      >
                      Workouts
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => removeClient(client.userId._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ManageClients;
