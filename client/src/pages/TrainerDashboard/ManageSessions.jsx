import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, ListGroup, Form } from "react-bootstrap";
import AddWorkout from "./AddWorkout";

function ManageSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState({
    sessionName: "",
    workoutType: "",
    date: "",
    maxParticipants: "",
    image: null
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTrainerSessions();
  }, []);

  const fetchTrainerSessions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/mysessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(Array.isArray(response.data.sessions) ? response.data.sessions : []);
    } catch (error) {
      console.error("Error fetching sessions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (sessionId, userId, approvalStatus) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/approveSessionRequest`,
        { sessionId, userId, approvalStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTrainerSessions();
    } catch (error) {
      console.error("Approval error:", error);
    }
  };



  const handleSessionInputChange = (e) => {
    const { name, value } = e.target;
    setSessionData({ ...sessionData, [name]: value });
  };

  const handleImageChange = (e) => {
    setSessionData({ ...sessionData, image: e.target.files[0] });
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("sessionName", sessionData.sessionName);
      formData.append("workoutType", sessionData.workoutType);
      formData.append("date", sessionData.date);
      formData.append("maxParticipants", sessionData.maxParticipants);
      formData.append("image", sessionData.image);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/createsession`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      alert("Session created successfully!");
      setSessionData({ sessionName: "", workoutType: "", date: "", maxParticipants: "", image: null });
      fetchTrainerSessions();
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session.");
    }
  };
  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4 text-warning" />;

  return (
    <div className="container mt-4">
      <h2 className="text-warning text-center">Manage Sessions</h2>

      {/* Create Session Form */}
      <Card className="mb-4 bg-dark text-light border-warning shadow-lg">
        <Card.Body>
          <h5 className="text-warning">Create New Session</h5>
          <Form onSubmit={handleCreateSession}>
            <Form.Group className="mb-3">
              <Form.Label>Session Name</Form.Label>
              <Form.Control type="text" name="sessionName" value={sessionData.sessionName} onChange={handleSessionInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Workout Type</Form.Label>
              <Form.Control type="text" name="workoutType" value={sessionData.workoutType} onChange={handleSessionInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control type="datetime-local" name="date" value={sessionData.date} onChange={handleSessionInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Max Participants</Form.Label>
              <Form.Control type="number" name="maxParticipants" value={sessionData.maxParticipants} onChange={handleSessionInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} required />
            </Form.Group>

            <Button variant="warning" type="submit" className="w-100">
              Create Session
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {sessions.length === 0 ? (
        <p className="text-light text-center">No sessions created.</p>
      ) : (
        <div className="row">
          {sessions.map((session) => (
            <div key={session._id} className="col-md-6 mb-3">
              <Card className="bg-dark text-light border-warning shadow-lg">
                <Card.Body>
                  <Card.Title className="text-warning">{session.sessionName}</Card.Title>
                  <Card.Text>
                    <strong>Workout Type:</strong> {session.workoutType} <br />
                    <strong>Date:</strong> {new Date(session.date).toLocaleString()} <br />
                    <strong>Participants:</strong> {session.bookings.filter(b => b.status === "approved").length}/{session.maxParticipants}
                  </Card.Text>

                  <h6 className="text-warning">Pending Requests</h6>
                  <ListGroup >
                    {session.bookings.map((booking) =>
                      booking.status === "pending" ? (
                        <ListGroup.Item key={booking.userId} className="d-flex justify-content-between">
                          {booking.userId}
                          <Button variant="success" size="sm" className="ms-2" onClick={() => handleApproval(session._id, booking.userId, "approved")}>Approve</Button>
                          <Button variant="danger" size="sm" className="ms-2" onClick={() => handleApproval(session._id, booking.userId, "rejected")}>Reject</Button>
                        </ListGroup.Item>
                      ) : null
                    )}
                  </ListGroup>

                  <AddWorkout sessionId={session._id} refreshSessions={fetchTrainerSessions} />
                  <h6 className="mt-3">Workouts:</h6>
                  {session.workouts.length === 0 ? (
                    <p>No workouts added yet.</p>
                  ) : (
                    <ul>
                      {session.workouts.map((w, index) => (
                        <li key={index}>
                          <p>{w.exercise} - {w.sets} Sets x {w.reps} Reps</p>
                          {w.meetingLink && (
                            <a href={w.meetingLink} target="_blank" rel="noopener noreferrer">
                              📅 Join Meeting
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>

                  )}

                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageSessions;
