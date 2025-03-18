import { useState } from "react";
import axios from "axios";
import { Card, Form, Button, ListGroup } from "react-bootstrap";

function AddWorkout({ sessionId, refreshSessions }) {
    const [exercise, setExercise] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [workouts, setWorkouts] = useState([]);
    const token = localStorage.getItem("token");

    // Add Workout to List
    const handleAddWorkout = () => {
        if (!exercise.trim() || !sets || !reps) {
            alert("Please fill all fields.");
            return;
        }

        setWorkouts([...workouts, { exercise, sets: Number(sets), reps: Number(reps) }]);
        setExercise("");
        setSets("");
        setReps("");
    };

    // Submit Workouts to Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (workouts.length === 0) {
            alert("Please add at least one workout.");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/trainer/addWorkoutToSession`,
                { sessionId, workouts },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(response.data.message);
            setWorkouts([]); // Clear list after submission
            refreshSessions(); // Refresh session data in ManageSessions
        } catch (error) {
            console.error("Error adding workouts:", error);
            alert("Failed to add workouts.");
        }
    };

    return (
        <>

<style>
                {`
                    .dark-input {
                        background-color: #343a40; 
                        color: #fff; 
                        margin: 2px;
                        border: 1px solid #ffc107; 
                    }

                    .dark-input::placeholder {
                        color: rgba(255, 255, 255, 0.6); 
                        opacity: 1;
                    }
                `}
            </style>
        
        <Card className="bg-dark text-light border-warning shadow-lg p-3">
            <h4 className="text-warning text-center">Add Workouts</h4>

            <Form className="mt-3">
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Exercise Name"
                        value={exercise}
                        onChange={(e) => setExercise(e.target.value)}
                        className="dark-input"                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Form.Control
                        type="number"
                        placeholder="Sets"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        className="dark-input"                    />
                    <Form.Control
                        type="number"
                        placeholder="Reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="dark-input"                    />
                </div>

                <Button variant="warning" className="mt-3 w-100" onClick={handleAddWorkout}>
                    Add Workout
                </Button>
            </Form>

            {/* Show Added Workouts */}
            {workouts.length > 0 && (
                <>
                    <h6 className="text-warning mt-3">Workouts Added</h6>
                    <ListGroup className="mb-3">
                        {workouts.map((w, index) => (
                            <ListGroup.Item key={index} className="bg-dark text-light border-warning">
                                {w.exercise} - {w.sets} Sets x {w.reps} Reps
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
            )}

            <Button variant="warning" className="w-100 mt-2" onClick={handleSubmit}>
                Submit Workouts
            </Button>
        </Card>
        </>
    );
}

export default AddWorkout;
