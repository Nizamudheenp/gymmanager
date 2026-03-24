import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner, Alert, ListGroup, Button, Card, Badge, Container } from "react-bootstrap"
import { toast } from "react-toastify"
import { FaUserClock, FaCheck, FaEnvelope } from "react-icons/fa"

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/getbookings`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAppointments(response.data.appointments || [])
      setLoading(false)
    } catch (error) {
      setError("Failed to fetch appointments.")
      setAppointments([])
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [token])

  const approveAppointment = async (appointmentId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/managebooking/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Appointment approved successfully!");
      fetchAppointments()
    } catch (error) {
      setError("Failed to approve appointment.")
    }
  }

  const pendingApprovals = appointments.filter((app) => app.status === "paid");

  return (
    <Container className="px-0">
      <div className="glass-card p-4 mb-4 border-white-10 shadow-lg d-flex justify-content-between align-items-center">
        <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-3">
            <FaUserClock className="text-warning" /> 
            <span>Pending Approvals</span>
        </h4>
        <Badge bg="warning-subtle" className="text-warning px-3 py-2 border border-warning-20">
            {pendingApprovals.length} REQUESTS
        </Badge>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
        </div>
      )}

      {error && (
        <Alert variant="danger" className="glass-card text-white border-danger mb-4">
          {error}
        </Alert>
      )}

      {!loading && pendingApprovals.length === 0 ? (
        <div className="text-center py-5 glass-card">
          <p className="text-white-50 mb-0 fst-italic">All caught up! No pending requests.</p>
        </div>
      ) : (
        <div className="client-modern-list d-flex flex-column gap-3">
          {pendingApprovals.map((appointment) => (
            <div key={appointment._id} className="client-row-glass d-flex align-items-center justify-content-between p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="client-avatar-pending">
                    {appointment.userId.username.charAt(0).toUpperCase()}
                </div>
                <div className="client-info">
                    <h6 className="text-white fw-bold mb-0">{appointment.userId.username}</h6>
                    <div className="d-flex align-items-center gap-2 text-white-50 small">
                        <FaEnvelope size={10} /> {appointment.userId.email}
                    </div>
                </div>
              </div>
              <Button
                className="btn-orange-glow px-4 d-flex align-items-center gap-2"
                onClick={() => approveAppointment(appointment._id)}
              >
                <FaCheck /> <span>Approve</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .client-avatar-pending {
            width: 45px;
            height: 45px;
            min-width: 45px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ff8c00;
            font-weight: 800;
            font-size: 1.2rem;
        }
        .client-row-glass {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .client-row-glass:hover {
            background: rgba(255, 255, 255, 0.07);
            border-color: rgba(255, 140, 0, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .btn-orange-glow {
            width: auto;
            min-width: 120px;
            white-space: nowrap;
        }
        .border-warning-20 { border-color: rgba(255, 140, 0, 0.2) !important; }
        @media (max-width: 576px) {
            .client-row-glass { flex-direction: column; align-items: flex-start; gap: 15px; }
            .btn-orange-glow { width: 100%; }
        }
      `}</style>
    </Container>
  )
}

export default Appointments
