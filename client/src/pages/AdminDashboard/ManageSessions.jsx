import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Modal, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";


function AdminManageSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [bookedUsers, setBookedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/allsessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/deletesession/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSessions();
      toast.success("Session deleted successfully!");
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session.");
    }
  };

  const handleViewBookedUsers = async (sessionId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/sessionbookings/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookedUsers(response.data.bookings);
      setSelectedSession(sessionId);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching booked users:", error);
      alert("Failed to fetch booked users.");
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4 text-warning" />;

  return (
    <div className="container mt-4">
      <h2 className="text-warning text-center">Manage Sessions</h2>

      {sessions.length === 0 ? (
        <p className="text-light text-center">No sessions available.</p>
      ) : (
        <div className="row">
          {sessions.map((session) => (
            <div key={session._id} className="col-md-6 mb-3">
              <Card className="bg-dark text-light border-warning shadow-lg p-3">
                <Card.Body>
                  <Card.Title className="text-warning">{session.sessionName}</Card.Title>
                  <Card.Text>
                    <strong>Trainer:</strong> {session.trainerId?.username} <br />
                    <strong>Workout Type:</strong> {session.workoutType} <br />
                    <strong>Date:</strong> {new Date(session.date).toLocaleString()} <br />
                    <strong>Participants:</strong> {session.bookings.filter(b => b.status === "approved").length}/{session.maxParticipants} <br />
                    <strong>status:</strong> {session.status} 
                  </Card.Text>

                  <Button variant="light" className="m-2" onClick={() => handleViewBookedUsers(session._id)}>
                    View Booked Users
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteSession(session._id)}>
                    Delete Session
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Booked Users Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>Booked Users</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          {bookedUsers.length === 0 ? (
            <p>No users booked for this session.</p>
          ) : (
            <ListGroup>
              {bookedUsers.map((user) => (
                <ListGroup.Item key={user.userId._id} className="d-flex justify-content-between">
                  {user.userId.username} ({user.userId.email}) - {user.status}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminManageSessions;
