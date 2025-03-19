import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/trainer/getbookings`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAppointments(response.data.appointments || []);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch appointmensts.");
            setAppointments([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [token]);

    const approveAppointment = async (appointmentId) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/trainer/managebooking/${appointmentId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchAppointments();
        } catch (error) {
            setError("Failed to approve appointment.");
        }
    };

    return (
        <div className="container mt-4">
            {loading && <p>Loading appointments...</p>}
            {error && <p className="text-danger">{error}</p>}

            <div className="mt-4">
                <h4>Pending Approvals</h4>
                {appointments.filter((app) => app.status === "paid").length === 0 ? (
                    <p>No pending approvals.</p>
                ) : (
                    <ul className="list-group">
                        {appointments
                            .filter((app) => app.status === "paid")
                            .map((appointment) => (
                                <li key={appointment._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {appointment.userId.username} - {appointment.userId.email}
                                    <button className="btn btn-success btn-sm" onClick={() => approveAppointment(appointment._id)}>
                                        Approve
                                    </button>
                                </li>
                            ))}
                    </ul>
                )}
            </div>

            <div className="mt-4">
                <h4>My Clients</h4>
                {appointments.filter((app) => app.status === "confirmed").length === 0 ? (
                    <p>No confirmed clients yet.</p>
                ) : (
                    <ul className="list-group">
                        {appointments
                            .filter((app) => app.status === "confirmed")
                            .map((appointment) => (
                                <li key={appointment._id} className="list-group-item">
                                    {appointment.userId.username} - {appointment.userId.email}
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Appointments;
