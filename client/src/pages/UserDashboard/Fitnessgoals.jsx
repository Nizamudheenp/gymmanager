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
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/getgoals`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            const sortedGoals = response.data.goals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            setGoals(sortedGoals.slice(0, 5)); 
        } catch (error) {
            console.log("Error fetching goals", error.message);
        }
    };
    

    const setGoal = async () => {
        try {
            if (!goalType || !targetProgress || !endDate) {
                alert("All fields are required!");
                return;
            }
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

    const deleteGoal = async (goalId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/deletegoal/${goalId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
        } catch (error) {
            console.log("Error deleting goal", error.message);
        }
    };

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
                <button className="btn btn-warning w-100"onClick={setGoal}>Set Goal</button>
            </div>

            <h5 className="mt-4 text-dark">My Goals</h5>

            {goals.length === 0 ? (
                <p className="text-secondary">No fitness goals set yet.</p>
            ) : (
                <ul className="list-group">
                    {goals.map((goal) => (
                        <li key={goal._id} className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center border-secondary">
                            <div>
                                <strong className="text-warning">{goal.goalType}</strong>  |  Progress: {goal.currentprogress || 0}/{goal.targetProgress}  |  Status: {goal.status || "In Progress"}
                            </div>
                            <div className='p-2'>
                            <button
                                className="btn btn-warning btn-sm me-3"
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
                            </div>
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>

    )
}

export default Fitnessgoals