import React, { useEffect, useState } from 'react'
import axios from "axios";

function Fitnessgoals() {
    const [goals, setGoals] = useState([]);
    const [goalType, setGoalType] = useState("")
    const [targetProgress, setTargetProgress] = useState("");
    const [endDate, setEndDate] = useState("");
    const token = localStorage.getItem("token")

    useEffect(() => {
        fetchGoals()
    }, [token])

    const fetchGoals = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getgoals`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setGoals(response.data.goals || [])
        } catch (error) {
            console.log("Error fetching goals", error.message);
        }
    }

    const setGoal = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/setgoal`,
                { goalType, targetProgress, endDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchGoals()
            setGoalType("");
            setTargetProgress("");
            setEndDate("");

        } catch (error) {
            console.log("Error setting goal", error.message);

        }
    }

    const updateProgress = async (goalId, currentProgress) => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/updategoal/${goalId}`,
                { currentprogress: currentProgress },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchGoals()
        } catch (error) {
            console.log("Error updating goal ", error.message);

        }
    }

    return (
        <div className="container mt-4">
            <h3 className="text-dark text-center">Fitness Goals</h3>

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
                    className="form-control mb-2 bg-secondary text-light border-0"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button className="btn btn-warning w-100">Set Goal</button>
            </div>

            <h5 className="mt-4 text-light">My Goals</h5>

            {goals.length === 0 ? (
                <p className="text-secondary">No fitness goals set yet.</p>
            ) : (
                <ul className="list-group">
                    {goals.map((goal) => (
                        <li key={goal._id} className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center border-secondary">
                            <div>
                                <strong className="text-warning">{goal.goalType}</strong> - Progress: {goal.currentprogress || 0}/{goal.targetProgress} - Status: {goal.status || "In Progress"}
                            </div>
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => updateProgress(goal._id, goal.currentprogress + 1)}
                                disabled={goal.currentprogress >= goal.targetProgress}
                            >
                                + Progress
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>

    )
}

export default Fitnessgoals