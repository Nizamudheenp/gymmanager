import React, { useEffect, useState } from "react";
import axios from "axios";

function AvailableTrainers() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token"); 

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/availabletrainers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTrainers(response.data.trainers);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch trainers");
            } finally {
                setLoading(false);
            }
        };
        fetchTrainers();
    }, []);

    if (loading) return <p>Loading available trainers...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-5">
            <h2 className="text-center">Available Trainers</h2>
            <div className="row">
                {trainers.map((trainer) => (
                    <div key={trainer._id} className="col-md-4">
                        <div className="card p-3 mb-3">
                            <h5>{trainer.username}</h5>
                            <p>Email: {trainer.email}</p>
                            <p>Specialization: {trainer.specialization}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvailableTrainers;
