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
} from "react-bootstrap";

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
    <Container className="mt-4">
      <Card className="bg-dark text-light p-4 mb-4 shadow">
        <Card.Title style={{ color: "#ff8c00" , marginBottom:"20px"}}>Assign New Workout</Card.Title>
        <Form>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Control
                type="text"
                placeholder="Exercise"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
              />
            </Col>
            <Col md={4} className="mb-3">
              <Form.Control
                type="number"
                placeholder="Sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </Col>
            <Col md={4} className="mb-3">
              <Form.Control
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </Col>
          </Row>
          <Button style={{ backgroundColor: "#ff8c00" ,border:"0"}} className="w-100 mt-3" onClick={assignWorkout}>
            Assign Workout
          </Button>
        </Form>
      </Card>

      {workouts.length === 0 ? (
        <p className="text-secondary">No workouts assigned yet.</p>
      ) : (
        <ListGroup>
          {workouts.map((exercise) => (
            <ListGroup.Item
              key={exercise._id}
              className="d-flex justify-content-between align-items-center bg-dark text-light p-3"
            >
              {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteWorkout(exercise._id)}
              >
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

export default ManageWorkouts;
