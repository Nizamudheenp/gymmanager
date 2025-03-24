import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UpcomingSessions({ limit = 1 }) {
    const [sessions, setSessions] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getsessions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const upcomingSessions = response.data.sessions
                    .filter(session => new Date(session.date) >= new Date()) 
                    .sort((a, b) => new Date(a.date) - new Date(b.date)) 
                    .slice(0, limit); 

                setSessions(upcomingSessions);
            } catch (error) {
                console.error("Error fetching upcoming sessions:", error);
            }
        };
        fetchSessions();
    }, []);

    return (
        <div >
            {sessions.length === 0 ? (
                <p>No upcoming sessions</p>
            ) : (
                sessions.map((session) => (
                    <div
                        key={session._id}
                        style={{
                            border: "1px solid rgba(255, 165, 0, 0.6)",
                            padding: "10px",
                            borderRadius: "10px",
                            background: "rgba(0, 0, 0, 0.7)", 
                            color: "white",
                            textAlign: "center",
                            maxWidth: "100%",
                            boxShadow: "0 4px 6px rgba(255, 165, 0, 0.2)",
                            cursor: "pointer"
                        }} 
                     onClick={() => navigate("/user-dashboard/session")}> 
                        <div >
                            <h4  style={{ marginBottom: "5px", fontSize: "1.1rem" }}>{session.sessionName}</h4>
                            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                                {new Date(session.date).toLocaleDateString()} <br />
                                <strong>Trainer:</strong> {session.trainerId?.username || "Unknown"} <br />
                                 {session.status}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default UpcomingSessions;
