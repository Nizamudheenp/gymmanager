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
        <div className="card p-3 shadow-sm bg-dark text-light" 
            style={{ cursor: "pointer" }}>
            <h5 style={{ color: "#ff8c00"}}>Complete Your Goals for Better Progress!</h5>
            {goals.length === 0 ? (
                <p className="text-secondary">No goals set yet. Start now!</p>
            ) : (
                goals.map((goal) => (
                    <div key={goal._id} className="mb-2">
                        <strong className="text-light">{goal.goalType}</strong>
                        <ProgressBar
                            now={(goal.currentprogress / goal.targetProgress) * 100}
                            label={`${goal.currentprogress}/${goal.targetProgress}`}
                            variant={goal.currentprogress >= goal.targetProgress ? "success" : "warning"}
                        />
                    </div>
                ))
            )}
        </div>
    );
}

export default UserGoalsWidget;
