import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

function Fitnessgoals() {
    const [goals, setGoals] = useState([]);
    const [goalType, setGoalType] = useState("")
    const [targetProgress, setTargetProgress] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token")

    useEffect(() => {
        fetchGoals()
    }, [token])

    const fetchGoals = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/getgoals`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const sortedGoals = response.data.goals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            setGoals(sortedGoals.slice(0, 5));
        } catch (error) {
            setError("Failed to fetch goals.");
        }
        setLoading(false);
    };


    const setGoal = async () => {
        if (!goalType || !targetProgress || targetProgress <= 0 || !endDate) {
            setError("All fields are required!");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/setgoal`,
                { goalType, targetProgress, endDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchGoals();
            setGoalType("");
            setTargetProgress("");
            setEndDate("");
            toast.success("Goal set successfully");
            setError("")
        } catch (error) {
            setError("Failed to set goal.");
        }
        setLoading(false);
    };


    const deleteGoal = async (goalId) => {
        setLoading(true);
        setError("");
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/deletegoal/${goalId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
        } catch (error) {
            setError("Failed to delete goal.");
        }
        setLoading(false);
    };

    const updateProgress = async (goalId, currentProgress) => {
        setLoading(true);
        setError("");
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/updategoal/${goalId}`,
                { currentprogress: currentProgress },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchGoals()
        } catch (error) {
            if (error.response?.data?.message === "You can only update progress once per day.") {
                toast.error("You can only update progress once per day.");
            } else {
                setError("Error updating goal", error.message);
            }
        }
        setLoading(false);

    }

    return (
        <div className="container mt-4">
            <h3 className="text-dark text-center">Fitness Goals</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && (
                <div className="text-center my-3">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            <div className="card p-3 shadow-sm bg-dark text-light">
                <h5 className="text-warning">Set New Goal</h5>
                <input
                    type="text"
                    className="form-control mb-2 bg-secondary text-light border-0"
                    placeholder="Goal Type"
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                />
                <input
                    type="number"
                    className="form-control mb-2 bg-secondary text-light border-0"
                    placeholder="Target Progress"
                    value={targetProgress}
                    onChange={(e) => setTargetProgress(e.target.value)}
                />
                <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="form-control mb-2 bg-secondary text-light border-0"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button className="btn btn-warning w-100" onClick={setGoal}>Set Goal</button>
            </div>

            <h5 className="mt-4 text-dark">My Goals</h5>

            {goals.length === 0 ? (
                <p className="text-secondary">No fitness goals set yet.</p>
            ) : (
                <ul className="list-group">
                    {goals.map((goal) => {
                        const progressPercentage = Math.round((goal.currentprogress / goal.targetProgress) * 100);
                        const progressColor =
                            progressPercentage >= 100 ? 'bg-success' :
                                progressPercentage >= 50 ? 'bg-warning text-dark' :
                                    'bg-info text-dark';

                        return (
                            <li key={goal._id} className="list-group-item bg-dark text-light border-secondary">
                                <Row className="align-items-center">
                                    <Col xs={12} md={8}>
                                        <strong className="text-warning">{goal.goalType}</strong>{" "}
                                        <span className={`badge ${goal.currentprogress >= goal.targetProgress ? "bg-success" : "bg-info text-dark"}`}>
                                            {goal.currentprogress >= goal.targetProgress ? "Completed" : "In Progress"}
                                        </span>
                                        <br />
                                        <small className="text-light">Target Date: {new Date(goal.endDate).toLocaleDateString()}</small>

                                    </Col>
                                    <Col xs={12} md={4} className="d-flex justify-content-md-end gap-2 mt-2 mt-md-0">
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => updateProgress(goal._id, goal.currentprogress + 1)}
                                            disabled={goal.currentprogress >= goal.targetProgress}
                                        >
                                            + Progress
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteGoal(goal._id)}
                                        >
                                            Delete
                                        </button>
                                    </Col>
                                </Row>

                                {/* Progress Bar */}
                                <div className="progress mt-2" style={{ height: '25px' }}>
                                    <div
                                        className={`progress-bar ${progressColor}`}
                                        role="progressbar"
                                        style={{ width: `${progressPercentage}%` }}
                                        aria-valuenow={goal.currentprogress}
                                        aria-valuemin={0}
                                        aria-valuemax={goal.targetProgress}
                                    >
                                        {progressPercentage}%
                                    </div>
                                </div>
                            </li>
                        );
                    })}

                </ul>
            )}
        </div>
    )
}

export default Fitnessgoals;
