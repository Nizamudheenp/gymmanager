import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Card, Spinner, Toast, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SessionDetails() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessionDetails();
  }, []);

  const fetchSessionDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/getsessiondetails/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSession(response.data);
    } catch (error) {
      console.error("Error fetching session details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDone = (workoutId) => {
    setCompletedWorkouts((prev) => [...prev, workoutId]);
    setShowToast(true);
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" variant="warning" />
      </div>
    );

  if (!session)
    return (
      <Container className="mt-5 text-center">
        <div className="alert alert-danger bg-dark text-danger border-0 rounded-4 p-5">
          <i className="fa-solid fa-circle-exclamation fs-1 mb-3"></i>
          <h3>Session Not Found</h3>
          <Button variant="outline-light" className="mt-3" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Container>
    );

  return (
    <Container className="mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <Card className="border-0 shadow-lg position-relative overflow-hidden mb-4"
            style={{ 
              background: "rgba(25, 25, 25, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
            }}
          >
            <div className="position-absolute top-0 start-0 w-100" 
              style={{ height: "3px", background: "#ff8c00" }}
            />
            
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-5">
                <Badge pill className="bg-warning text-dark px-3 py-2 mb-3 fw-bold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
                  Session Overview
                </Badge>
                <h2 className="text-white fw-bold display-6 mb-2">{session.sessionName}</h2>
                <div className="d-flex align-items-center justify-content-center text-secondary">
                  <i className="fa-solid fa-user-tie me-2" style={{ color: "#ff8c00" }}></i>
                  <span className="fw-bold">{session.trainerId?.username || "Lead Coach"}</span>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h4 className="text-white fw-bold mb-0">
                  <i className="fa-solid fa-dumbbell me-2" style={{ color: "#ff8c00" }}></i>
                  Assigned Workouts
                </h4>
                <Button
                  className="fw-bold border-0 shadow-sm"
                  style={{ 
                    background: "rgba(255, 140, 0, 0.1)", 
                    color: "#ff8c00",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255, 140, 0, 0.2)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255, 140, 0, 0.1)"; }}
                  onClick={() => navigate(`/user-dashboard/review-trainer/${session.trainerId?._id}`)}
                >
                  <i className="fa-solid fa-star me-2"></i>Review Trainer
                </Button>
              </div>

              {session.workouts.length > 0 ? (
                <div className="row g-3">
                  {session.workouts.map((workout) => (
                    <div key={workout._id} className="col-12">
                      <Card className="border-0" 
                        style={{ 
                          background: "rgba(255, 255, 255, 0.03)", 
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          borderRadius: "12px"
                        }}
                      >
                        <Card.Body className="p-4">
                          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                            <div>
                              <h5 className="text-white fw-bold mb-2">{workout.exercise}</h5>
                              <div className="d-flex gap-3 text-secondary small">
                                <span><strong className="text-white">{workout.sets}</strong> Sets</span>
                                <span><strong className="text-white">{workout.reps}</strong> Reps</span>
                              </div>
                            </div>
                            
                            <div className="d-flex flex-column flex-sm-row gap-2" style={{ minWidth: "200px" }}>
                              {workout.meetingLink && (
                                <a
                                  href={workout.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm d-flex align-items-center justify-content-center fw-bold"
                                  style={{ background: "#ff8c00", color: "#000", borderRadius: "8px", padding: "8px 16px" }}
                                >
                                  <i className="fa-solid fa-video me-2"></i>Meet
                                </a>
                              )}
                              <Button
                                variant={completedWorkouts.includes(workout._id) ? "success" : "outline-warning"}
                                className="btn-sm fw-bold border-0"
                                style={{ 
                                  borderRadius: "8px", 
                                  padding: "8px 16px",
                                  background: completedWorkouts.includes(workout._id) ? "rgba(40, 167, 69, 0.2)" : "rgba(255, 140, 0, 0.05)",
                                  color: completedWorkouts.includes(workout._id) ? "#28a745" : "#ff8c00"
                                }}
                                disabled={completedWorkouts.includes(workout._id)} 
                                onClick={() => handleMarkAsDone(workout._id)}
                              >
                                {completedWorkouts.includes(workout._id) ? (
                                  <><i className="fa-solid fa-check-circle me-1"></i>Done</>
                                ) : (
                                  "Mark as Done"
                                )}
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-5 rounded-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
                  <p className="text-secondary mb-0">No workouts assigned to this session yet.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        className="position-fixed bottom-0 end-0 m-3 border-0 shadow-lg"
        style={{ background: "rgba(40, 167, 69, 0.9)", backdropFilter: "blur(10px)", color: "#fff", borderRadius: "12px" }}
      >
        <Toast.Body className="d-flex align-items-center p-3">
          <i className="fa-solid fa-circle-check fs-4 me-3"></i>
          <span className="fw-bold">Workout marked as completed!</span>
        </Toast.Body>
      </Toast>
    </Container>
  );
}

export default SessionDetails;
