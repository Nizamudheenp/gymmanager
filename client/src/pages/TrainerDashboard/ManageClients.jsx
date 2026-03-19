import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert, Badge, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaDumbbell, FaUtensils, FaUserMinus, FaEnvelope } from "react-icons/fa";

function ManageClients() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const removeClient = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this client?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/removeclient/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClients((prev) =>
        prev.filter((client) => client.userId._id !== userId)
      );
    } catch (error) {
      console.error("Failed to remove client:", error.message);
    }
  };

  const confirmedClients = clients.filter(c => c.status === "confirmed");

  const filteredClients = confirmedClients.filter(c =>
    c.userId.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="px-0">
      <div className="glass-card p-4 mb-4 border-white-10 shadow-lg">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
            <div className="glass-search-bar">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input border-0 text-white"
              />
            </div>
          </div>
          <Badge bg="warning-subtle" className="text-warning px-3 py-2 border border-warning-20">
            {confirmedClients.length} ACTIVE CLIENTS
          </Badge>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3 text-white-50">Synchronizing client records...</p>
        </div>
      )}

      {error && <Alert variant="danger" className="glass-card text-white border-danger">{error}</Alert>}

      {!loading && filteredClients.length === 0 && (
        <div className="text-center py-5 glass-card">
          <p className="text-white-50 mb-0">
            {searchTerm ? `No results matching "${searchTerm}"` : "No active clients yet."}
          </p>
        </div>
      )}

      <div className="client-modern-list d-flex flex-column gap-3">
        {filteredClients.map((client) => (
          <div key={client._id} className="client-row-glass d-flex align-items-center justify-content-between p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="client-avatar-glow">
                {client.userId.username.charAt(0).toUpperCase()}
              </div>
              <div className="client-info">
                <h6 className="text-white fw-bold mb-0">{client.userId.username}</h6>
                <div className="d-flex align-items-center gap-2 text-white-50 small">
                  <FaEnvelope size={10} /> {client.userId.email}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 action-group">
              <button
                className="btn-minimal-action"
                title="Manage Workouts"
                onClick={() => navigate(`/trainer-dashboard/manage-workouts/${client.userId._id}`)}
              >
                <FaDumbbell className="me-2" /> <span>Workouts</span>
              </button>
              <button
                className="btn-minimal-action"
                title="Client Nutrition"
                onClick={() => navigate(`/trainer-dashboard/manage-nutritions/${client.userId._id}`)}
              >
                <FaUtensils className="me-2" /> <span>Nutrition</span>
              </button>
              <button
                className="btn-minimal-danger"
                title="Remove Client"
                onClick={() => removeClient(client.userId._id)}
              >
                <FaUserMinus />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .client-row-glass {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }
        .client-row-glass:hover {
            background: rgba(255, 255, 255, 0.07);
            border-color: rgba(255, 140, 0, 0.2);
            transform: translateX(5px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .client-avatar-glow {
            width: 45px;
            height: 45px;
            min-width: 45px;
            background: linear-gradient(135deg, #ff8c00, #ff4500);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-weight: 800;
            font-size: 1.2rem;
            box-shadow: 0 0 15px rgba(255, 140, 0, 0.3);
        }
        .btn-minimal-action {
            background: rgba(255, 140, 0, 0.1);
            border: 1px solid rgba(255, 140, 0, 0.2);
            color: #ff8c00;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            border-style: solid;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        .btn-minimal-action:hover {
            background: #ff8c00;
            color: #000;
            box-shadow: 0 0 15px rgba(255, 140, 0, 0.4);
        }
        .btn-minimal-danger {
            background: rgba(220, 53, 69, 0.1);
            border: 1px solid rgba(220, 53, 69, 0.2);
            color: #dc3545;
            padding: 8px 12px;
            border-radius: 8px;
            transition: all 0.2s ease;
            border-style: solid;
        }
        .btn-minimal-danger:hover {
            background: #dc3545;
            color: white;
        }
        .glass-search-bar {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            padding: 2px 15px;
            gap: 10px;
            transition: all 0.3s ease;
        }
        .glass-search-bar:focus-within {
            border-color: rgba(255, 140, 0, 0.4);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 15px rgba(255, 140, 0, 0.1);
        }
        .search-icon { color: rgba(255, 255, 255, 0.4); font-size: 0.9rem; }
        .search-input {
            background: transparent !important;
            box-shadow: none !important;
            font-size: 0.9rem;
            padding: 8px 0;
            color: white !important;
        }
        .search-input::placeholder { color: rgba(255, 255, 255, 0.3); }
        .border-warning-20 { border-color: rgba(255, 140, 0, 0.2) !important; }
        @media (max-width: 768px) {
            .client-row-glass { flex-direction: column; align-items: flex-start; gap: 15px; padding: 20px !important; }
            .action-group { width: 100%; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
            .btn-minimal-action { flex: 1; justify-content: center; min-width: 120px; }
            .btn-minimal-danger { flex: 0 0 auto; width: 45px; }
        }
      `}</style>
    </Container>
  );
}

export default ManageClients;
