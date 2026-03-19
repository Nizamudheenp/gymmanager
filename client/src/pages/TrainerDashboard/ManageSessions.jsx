import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Form, Row, Col, Badge } from "react-bootstrap";
import AddWorkout from "./AddWorkout";
import { toast } from "react-toastify";
import "./TrainerDashboard.css";

function ManageSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
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
      toast.success(`Request ${approvalStatus} successfully`);
      fetchTrainerSessions();
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to update request status");
    }
  };

  const handleStatusToggle = async (sessionId, currentStatus) => {
    const newStatus = currentStatus === "available" ? "completed" : "available";
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/updateSessionStatus/${sessionId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Session marked as ${newStatus}`);
      fetchTrainerSessions();
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update session status");
    }
  };

  const handleSessionInputChange = (e) => {
    const { name, value } = e.target;
    setSessionData({ ...sessionData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSessionData({ ...sessionData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!sessionData.image) {
      return toast.error("Please upload a session image");
    }

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

      toast.success("Session created successfully");
      setSessionData({ sessionName: "", workoutType: "", date: "", maxParticipants: "", image: null });
      setImagePreview(null);
      fetchTrainerSessions();
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session.");
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/deleteSession/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Session deleted successfully!");
      fetchTrainerSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session.");
    }
  };

  const handleDeleteWorkout = async (sessionId, workoutIndex) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/deleteWorkoutFromSession`,
        { sessionId, workoutIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchTrainerSessions();
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast.error("Failed to delete workout.");
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4 text-warning" />;

  return (
    <div className="trainer-dashboard-container">
      <div className="container">
        <h2 className="text-center mb-5" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Session <span style={{ color: '#ff8c00' }}>Management</span>
        </h2>

        <Card className="glass-card mb-5 p-4">
          <Card.Body>
            <h4 className="card-title-orange">
              <i className="fas fa-plus-circle me-2"></i> Create New Session
            </h4>
            <Form onSubmit={handleCreateSession}>
              <Row>
                <Col md={6}>
                  <div className="image-preview-container">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                    ) : (
                      <div className="text-center">
                        <i className="fas fa-cloud-upload-alt fa-3x mb-2" style={{ color: 'rgba(255,140,0,0.5)' }}></i>
                        <p className="no-image-text">Upload Session Image</p>
                      </div>
                    )}
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="file"
                      onChange={handleImageChange}
                      className="glass-form-control"
                      accept="image/*"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="glass-form-label">Session Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="sessionName"
                      value={sessionData.sessionName}
                      onChange={handleSessionInputChange}
                      className="glass-form-control"
                      placeholder="e.g., Morning HIIT"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="glass-form-label">Workout Type</Form.Label>
                    <Form.Control
                      type="text"
                      name="workoutType"
                      value={sessionData.workoutType}
                      onChange={handleSessionInputChange}
                      className="glass-form-control"
                      placeholder="e.g., Cardio, Strength"
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="glass-form-label">Date & Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="date"
                          value={sessionData.date}
                          onChange={handleSessionInputChange}
                          className="glass-form-control"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="glass-form-label">Max Participants</Form.Label>
                        <Form.Control
                          type="number"
                          name="maxParticipants"
                          value={sessionData.maxParticipants}
                          onChange={handleSessionInputChange}
                          className="glass-form-control"
                          placeholder="e.g., 10"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="submit" className="w-100 btn-orange-glow mt-2" style={{ padding: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <i className="fas fa-plus-circle me-2"></i> Create Session
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        <h4 className="mb-4" style={{ fontWeight: '700' }}>
          <i className="fas fa-calendar-alt me-2 text-orange"></i> Your Sessions
        </h4>

        {sessions.length === 0 ? (
          <div className="glass-card p-5 text-center">
            <i className="fas fa-info-circle fa-2x mb-3 text-orange"></i>
            <p className="mb-0">No sessions created yet. Start by creating your first session above!</p>
          </div>
        ) : (
          <Row>
            {sessions.map((session) => (
              <Col lg={6} key={session._id} className="mb-4">
                <Card className="glass-card h-100">
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={session.image}
                      alt={session.sessionName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Badge
                      bg={session.status === 'completed' ? 'success' : 'warning'}
                      style={{ position: 'absolute', top: '15px', right: '15px', padding: '8px 12px', borderRadius: '8px' }}
                    >
                      {session.status.toUpperCase()}
                    </Badge>
                  </div>
                  <Card.Body className="p-4">
                    <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                      <h4 style={{ color: '#ff8c00', fontWeight: '800', marginBottom: '0' }}>{session.sessionName}</h4>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteSession(session._id)}
                        style={{ borderRadius: '8px', border: 'none' }}
                        title="Delete Session"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </div>

                    <div className="session-info-item">
                      <i className="fas fa-dumbbell session-icon"></i>
                      <span><strong>Type:</strong> <span style={{ color: '#fff' }}>{session.workoutType}</span></span>
                    </div>
                    <div className="session-info-item">
                      <i className="fas fa-clock session-icon"></i>
                      <span><strong>Date:</strong> <span style={{ color: '#fff' }}>{new Date(session.date).toLocaleString()}</span></span>
                    </div>
                    <div className="session-info-item">
                      <i className="fas fa-users session-icon"></i>
                      <span><strong>Capacity:</strong> <span style={{ color: '#fff' }}>{session.bookings.filter(b => b.status === "approved").length} / {session.maxParticipants}</span></span>
                    </div>

                    <div className="requests-container py-3">
                      <h6 style={{ color: '#ff8c00', fontWeight: '700', marginBottom: '15px' }}>
                        <i className="fas fa-user-check me-2"></i> Approved Clients
                      </h6>
                      {session.bookings.filter(b => b.status === "approved").length === 0 ? (
                        <p className="small text-white-50 italic text-center">No approved clients yet</p>
                      ) : (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {session.bookings.map((booking) =>
                            booking.status === "approved" ? (
                              <Badge key={booking.userId._id} bg="success" className="p-2" style={{ borderRadius: '8px' }}>
                                <i className="fas fa-user me-1"></i> {booking.userId.username}
                              </Badge>
                            ) : null
                          )}
                        </div>
                      )}

                      <h6 style={{ color: '#ff8c00', fontWeight: '700', marginBottom: '15px', marginTop: '20px' }}>
                        <i className="fas fa-user-clock me-2"></i> Pending Requests
                      </h6>
                      {session.bookings.filter(b => b.status === "pending").length === 0 ? (
                        <p className="small text-white-50 italic text-center">No pending requests</p>
                      ) : (
                        session.bookings.map((booking) =>
                          booking.status === "pending" ? (
                            <div key={booking.userId._id} className="request-item">
                              <span className="text-break" style={{ fontWeight: '500', color: '#fff' }}>{booking.userId.username}</span>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleApproval(session._id, booking.userId._id, "approved")}
                                  style={{ borderRadius: '6px' }}
                                >
                                  <i className="fas fa-check"></i>
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleApproval(session._id, booking.userId._id, "rejected")}
                                  style={{ borderRadius: '6px' }}
                                >
                                  <i className="fas fa-times"></i>
                                </Button>
                              </div>
                            </div>
                          ) : null
                        )
                      )}
                    </div>

                    <div className="workouts-section">
                      <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                        <h6 style={{ color: '#ff8c00', fontWeight: '700', margin: '0' }}>
                          <i className="fas fa-tasks me-2"></i> Session Workouts
                        </h6>
                      </div>
                      <div className="mb-3">
                        <AddWorkout sessionId={session._id} refreshSessions={fetchTrainerSessions} />
                      </div>

                      {session.workouts.length === 0 ? (
                        <p className="small text-white-50 italic text-center">No workouts added yet</p>
                      ) : (
                        <div className="workouts-list mt-2">
                          {session.workouts.map((w, index) => (
                            <div key={index} className="workout-item py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-0 text-white" style={{ fontWeight: '600' }}>{w.exercise}</p>
                                  <small className="text-warning">
                                    <i className="fas fa-sync-alt me-1"></i> {w.sets} Sets × {w.reps} Reps
                                  </small>
                                  {w.meetingLink && (
                                    <div className="mt-1">
                                      <Badge bg="info" as="a" href={w.meetingLink} target="_blank" style={{ textDecoration: 'none', cursor: 'pointer', fontSize: '0.7rem' }}>
                                        <i className="fas fa-video me-1"></i> Meeting
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteWorkout(session._id, index)}
                                  style={{ border: 'none', padding: '5px' }}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      className={`w-100 mt-4 ${session.status === 'completed' ? 'btn-secondary-glass' : 'btn-orange-glow'}`}
                      onClick={() => handleStatusToggle(session._id, session.status)}
                    >
                      <i className={`fas ${session.status === 'completed' ? 'fa-undo' : 'fa-check-circle'} me-2`}></i>
                      {session.status === 'completed' ? 'Mark as Available' : 'Mark as Completed'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default ManageSessions;
