import { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Row, Col, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "./TrainerDashboard.css";

function AddWorkout({ sessionId, refreshSessions }) {
    const [exercise, setExercise] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [showForm, setShowForm] = useState(false);
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!exercise.trim() || !sets || !reps) {
            toast.warning("Please fill all required fields.");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/trainer/addWorkoutToSession`,
                { 
                    sessionId, 
                    workouts: [{ exercise, sets: Number(sets), reps: Number(reps), meetingLink }] 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Workout added successfully!");
            setExercise("");
            setSets("");
            setReps("");
            setMeetingLink("");
            setShowForm(false);
            refreshSessions();
        } catch (error) {
            console.error("Error adding workout:", error);
            const errorMessage = error.response?.data?.message || "";
            
            if (errorMessage.toLowerCase().includes("no approved users")) {
                toast.warning("Minimum one participant needed to add workout");
            } else {
                toast.error(errorMessage || "Failed to add workout.");
            }
        }
    };

    return (
        <div className="add-workout-container">
            {!showForm ? (
                <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => setShowForm(true)}
                    style={{ borderRadius: '8px', fontWeight: '600' }}
                >
                    <i className="fas fa-plus me-1"></i> Add Workout
                </Button>
            ) : (
                <Card className="glass-card p-4 mt-3" style={{ border: '1px solid rgba(255, 140, 0, 0.2)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 style={{ color: "#ff8c00", margin: 0, fontWeight: '700' }}>
                            <i className="fas fa-dumbbell me-2"></i> New Workout
                        </h5>
                        <Button
                            variant="link"
                            className="text-light p-0"
                            onClick={() => setShowForm(false)}
                        >
                            <i className="fas fa-times"></i>
                        </Button>
                    </div>

                    <Form onSubmit={handleSubmit} className="mt-2">
                        <Form.Group className="mb-3">
                            <div className="position-relative">
                                <i className="fas fa-running position-absolute" style={{ left: '15px', top: '15px', color: '#ff8c00', zIndex: 1 }}></i>
                                <Form.Control
                                    type="text"
                                    placeholder="Exercise Name (e.g., Squats)"
                                    value={exercise}
                                    onChange={(e) => setExercise(e.target.value)}
                                    className="glass-form-control ps-5"
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="position-relative">
                                <i className="fas fa-layer-group position-absolute" style={{ left: '15px', top: '15px', color: '#ff8c00', zIndex: 1 }}></i>
                                <Form.Control
                                    type="number"
                                    placeholder="Sets"
                                    value={sets}
                                    onChange={(e) => setSets(e.target.value)}
                                    className="glass-form-control ps-5"
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="position-relative">
                                <i className="fas fa-redo position-absolute" style={{ left: '15px', top: '15px', color: '#ff8c00', zIndex: 1 }}></i>
                                <Form.Control
                                    type="number"
                                    placeholder="Reps"
                                    value={reps}
                                    onChange={(e) => setReps(e.target.value)}
                                    className="glass-form-control ps-5"
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="position-relative">
                                <i className="fas fa-link position-absolute" style={{ left: '15px', top: '15px', color: '#ff8c00', zIndex: 1 }}></i>
                                <Form.Control
                                    type="text"
                                    placeholder="Meeting Link (Optional)"
                                    value={meetingLink}
                                    onChange={(e) => setMeetingLink(e.target.value)}
                                    className="glass-form-control ps-5"
                                />
                            </div>
                        </Form.Group>

                        <Button type="submit" className="w-100 btn-orange-glow mt-2">
                            <i className="fas fa-plus-circle me-1"></i> Add Workout
                        </Button>
                    </Form>
                </Card>
            )}
        </div>
    );
}

export default AddWorkout;
