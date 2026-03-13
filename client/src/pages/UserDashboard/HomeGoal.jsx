import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProgressBar } from "react-bootstrap";

function UserGoalsWidget() {
    const [goals, setGoals] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/getgoals`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const sortedResponse = response.data.goals.sort((a,b)=> new Date(b.startDate) - new Date(a.startDate))
            setGoals(sortedResponse.slice(0, 2) || []);
        } catch (error) {
            console.log("Error fetching goals", error.message);
        }
    };

    return (
        <div className="w-100" style={{ textAlign: "left" }}>
            <h5 style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1rem", fontWeight: "600", marginBottom: "15px" }}>Active Milestones</h5>
            {goals.length === 0 ? (
                <div className="text-center p-3" style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "10px", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
                    <p className="mb-0" style={{ opacity: 0.5, fontSize: "0.85rem" }}>No goals set yet. Start now!</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {goals.map((goal) => (
                        <div key={goal._id} style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "12px" }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>{goal.goalType}</span>
                                <span style={{ fontSize: "0.85rem", color: "#ff8c00", fontWeight: "700" }}>
                                    {Math.round((goal.currentprogress / goal.targetProgress) * 100)}%
                                </span>
                            </div>
                            <div style={{ height: "6px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "10px", overflow: "hidden" }}>
                                <div 
                                    style={{ 
                                        height: "100%", 
                                        width: `${(goal.currentprogress / goal.targetProgress) * 100}%`,
                                        background: goal.currentprogress >= goal.targetProgress ? "#28a745" : "linear-gradient(90deg, #ff8c00, #ffa500)",
                                        borderRadius: "10px",
                                        transition: "width 0.5s ease"
                                    }} 
                                />
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)", marginTop: "6px", textAlign: "right" }}>
                                {goal.currentprogress} / {goal.targetProgress} units
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserGoalsWidget;
