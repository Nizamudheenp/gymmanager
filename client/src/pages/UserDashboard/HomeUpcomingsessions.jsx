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
                const sessionList = response.data.sessions || [];
                const upcomingSessions = sessionList
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
        <div className="d-flex flex-column gap-3">
            {sessions.length === 0 ? (
                <div className="text-center p-4 rounded-4" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
                    <p className="text-secondary small mb-0">No upcoming sessions today</p>
                </div>
            ) : (
                sessions.map((session) => (
                    <div
                        key={session._id}
                        className="p-3 transition-all"
                        style={{
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                            borderRadius: "12px",
                            background: "rgba(25, 25, 25, 0.4)",
                            backdropFilter: "blur(10px)",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "rgba(40, 40, 40, 0.6)";
                            e.currentTarget.style.borderColor = "rgba(255, 140, 0, 0.3)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "rgba(25, 25, 25, 0.4)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onClick={() => navigate("/user-dashboard/session")}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="text-white fw-bold mb-0" style={{ fontSize: "0.95rem" }}>{session.sessionName}</h6>
                            <span className="badge rounded-pill" style={{ background: "rgba(255, 140, 0, 0.1)", color: "#ff8c00", fontSize: "0.6rem", letterSpacing: "0.5px" }}>
                                {session.workoutType}
                            </span>
                        </div>
                        <div className="d-flex align-items-center text-secondary small gap-3">
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-calendar-day me-1" style={{ fontSize: "0.75rem", color: "#ff8c00" }}></i>
                                {new Date(session.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-clock me-1" style={{ fontSize: "0.75rem", color: "#ff8c00" }}></i>
                                {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="d-flex align-items-center ms-auto">
                                <i className="fa-solid fa-user-tie me-1" style={{ fontSize: "0.75rem" }}></i>
                                {session.trainerId?.username || "Coach"}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default UpcomingSessions;
