import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";

function ManageClients() {
  const [clients, setClients] = useState([]);
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

  return (
    <Container className="mt-4">
      {loading && (
        <div className="text-center text-light">
          <Spinner animation="border" variant="warning" />
          <p>Loading clients...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && confirmedClients.length === 0 && (
        <p className="text-light text-center">No confirmed clients yet.</p>
      )}

      <Row>
        {confirmedClients.map((client) => (
          <Col key={client._id} xs={12} md={4} lg={3} className="mb-4">
            <Card className="bg-dark text-light p-3 shadow">
              <Card.Body>
                <Card.Title style={{ color: "#ff8c00" }}>{client.userId.username}</Card.Title>
                <Card.Text>{client.userId.email}</Card.Text>
                <div className="d-flex justify-content-between mt-3 flex-wrap gap-2">
                  <Button
                    style={{ backgroundColor: "#ff8c00", border: "0", color: "black", padding: '3px 11px' }}
                    onClick={() =>
                      navigate(`/trainer-dashboard/manage-workouts/${client.userId._id}`)
                    }
                  >
                    Workouts
                  </Button>
                  <Button
                    style={{ backgroundColor: "#ff8c00", border: "0", color: "black", padding: '3px 9px' }}
                    onClick={() =>
                      navigate(`/trainer-dashboard/manage-nutritions/${client.userId._id}`)
                    }
                  >
                    Nutritions
                  </Button>
                  <Button
                    style={{ backgroundColor: "red", border: "0", color: "black", padding: '3px 16px' }}
                    onClick={() => removeClient(client.userId._id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ManageClients;
