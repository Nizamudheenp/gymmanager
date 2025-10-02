import { useState } from "react";
import axios from "axios";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";


function AddWorkout({ sessionId, refreshSessions }) {
    const [exercise, setExercise] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [workouts, setWorkouts] = useState([]);
    const token = localStorage.getItem("token");

    const handleAddWorkout = () => {
        if (!exercise.trim() || !sets || !reps) {
            toast.warning("Please fill all fields.");
            return;
        }

        setWorkouts([...workouts, { exercise, sets: Number(sets), reps: Number(reps), meetingLink }]);
        setExercise("");
        setSets("");
        setReps("");
        setMeetingLink("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (workouts.length === 0) {
            toast.error("Please add at least one workout.");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/trainer/addWorkoutToSession`,
                { sessionId, workouts },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(response.data.message);
            setWorkouts([]); 
            refreshSessions(); 
        } catch (error) {
            console.error("Error adding workouts:", error);
            toast.error("Failed to add workouts.");
        }
    };

    return (
        <>
            <style>
                {`
                    .dark-input {
                        background-color: #343a40; 
                        color: #fff; 
                        margin: 3px;
                        border: 1px solid  #ff8c00;
                    }

                    .dark-input::placeholder {
                        color: rgba(255, 255, 255, 0.6); 
                        opacity: 1;
                    }
                `}
            </style>

            <Card style={{ borderColor: "#ff8c00" }} className="bg-dark text-light shadow-lg p-4 mt-3">
                <h4 style={{ color: "#ff8c00" , textAlign:"center" }}>Workout Of The Day</h4>

                <Form className="mt-3">
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Exercise Name"
                            value={exercise}
                            onChange={(e) => setExercise(e.target.value)}
                            className="dark-input" />
                    </Form.Group>

                    <div className="d-flex">
                        <Form.Control
                            type="number"
                            placeholder="Sets"
                            value={sets}
                            onChange={(e) => setSets(e.target.value)}
                            className="dark-input" />
                        <Form.Control
                            type="number"
                            placeholder="Reps"
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            className="dark-input" />
                    </div>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Meeting Link (Zoom, Google Meet, etc.)"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            className="dark-input"
                        />
                    </Form.Group>

                    <Button style={{ backgroundColor: "#ff8c00", border:"0" }} className="mt-3 w-100" onClick={handleAddWorkout}>
                        Add Workout
                    </Button>
                </Form>

                {/* Added Workouts */}
                {workouts.length > 0 && (
                    <>
                        <h6 style={{ color: "#ff8c00", marginTop:"20px", marginBottom:"10px" }}>Workouts Added</h6>
                        <ListGroup className="mb-1 m-1 p-2 border-0">
                            {workouts.map((w, index) => (
                                <div key={index} className="mb-3 d-flex items-center gap-3">
                                    <p >{w.exercise} - {w.sets} Sets x {w.reps} Reps</p>
                                    {w.meetingLink && (
                                        <a href={w.meetingLink} target="_blank" rel="noopener noreferrer">
                                            Join Meeting
                                        </a>
                                    )}
                                </div>
                            ))}

                        </ListGroup>
                    </>
                )}

                <Button style={{ backgroundColor: "#ff8c00" ,border:"0" , marginTop:"20px"}} className="w-100" onClick={handleSubmit}>
                    Submit Workouts
                </Button>
            </Card>
        </>
    );
}

export default AddWorkout;
