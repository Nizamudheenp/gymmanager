import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { toast } from "react-toastify";

function ManageWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const token = localStorage.getItem("token");
  const { userId } = useParams();

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/getuserworkouts/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error("Failed to fetch workouts");
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [userId, token]);

  const assignWorkout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/assignworkouts`,
        {
          userId,
          exercises: [{ name: exercise, sets, reps }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExercise("");
      setSets("");
      setReps("");
      fetchWorkouts();
    } catch (error) {
      console.error("Error assigning workout:", error.message);
    }
  };

  const deleteWorkout = async (exerciseId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/deleteworkout/${exerciseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWorkouts();
    } catch (error) {
      console.error("Error deleting exercise:", error.message);
    }
  };

  return (
    <Container className="px-0 pt-2">
      <Card className="glass-card border-0 p-4 mb-4 shadow-lg">
        <h4 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
            <i className="fas fa-plus-circle text-warning"></i> Assign New Exercise
        </h4>
        <Form>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label className="text-white-50 small">Exercise Name</Form.Label>
              <div className="position-relative">
                <i className="fas fa-running position-absolute" style={{ left: '15px', top: '15px', color: '#ff8c00', zIndex: 1 }}></i>
                <Form.Control
                  type="text"
                  placeholder="e.g. Bench Press"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="glass-form-control ps-5"
                />
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Label className="text-white-50 small">Sets</Form.Label>
              <div className="position-relative">
                <i className="fas fa-layer-group position-absolute" style={{ left: '15px', top: '15px', color: '#ff8c00', zIndex: 1 }}></i>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="glass-form-control ps-5"
                />
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Label className="text-white-50 small">Reps</Form.Label>
              <div className="position-relative">
                <i className="fas fa-redo position-absolute" style={{ left: '15px', top: '15px', color: '#ff8c00', zIndex: 1 }}></i>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="glass-form-control ps-5"
                />
              </div>
            </Col>
          </Row>
          <Button className="btn-orange-glow w-100 mt-2" onClick={assignWorkout}>
            Assign Workout
          </Button>
        </Form>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white fw-bold mb-0">Current Workout Plan</h5>
          <Badge bg="warning" text="dark" className="px-3">{workouts.length} Exercises</Badge>
      </div>

      {workouts.length === 0 ? (
        <div className="glass-card p-5 text-center">
            <p className="text-white-50 mb-0 italic">No workouts assigned yet.</p>
        </div>
      ) : (
        <div className="row">
          {workouts.map((exercise) => (
            <div key={exercise._id} className="col-12 mb-2">
                <Card className="glass-card bg-dark-50 border-0 p-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-warning-subtle p-2 rounded text-warning">
                                <i className="fas fa-dumbbell"></i>
                            </div>
                            <div>
                                <h6 className="text-white fw-bold mb-1">{exercise.name}</h6>
                                <span className="text-warning small fw-bold">{exercise.sets} Sets × {exercise.reps} Reps</span>
                            </div>
                        </div>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            style={{ borderRadius: '8px' }}
                            onClick={() => deleteWorkout(exercise._id)}
                        >
                            <i className="fas fa-trash-alt"></i>
                        </Button>
                    </div>
                </Card>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default ManageWorkouts;
