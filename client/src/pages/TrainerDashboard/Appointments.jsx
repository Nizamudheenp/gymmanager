import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner, Alert, ListGroup, Button, Card } from "react-bootstrap"

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

      fetchAppointments()
    } catch (error) {
      setError("Failed to approve appointment.")
    }
  }

  return (
    <div className="container mt-4">
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" variant="warning" />
        </div>
      )}
      {error && (
        <Alert variant="danger" className="text-center fw-bold">
          {error}
        </Alert>
      )}

      <Card
        className="shadow-lg mb-4"
        style={{ backgroundColor: "#1c1c1c", color: "#f8f9fa" }}
      >
        <Card.Body>
          <h4 className="fw-bold mb-3" style={{ color: "#ff8c00" }}>
            Pending Approvals
          </h4>

          {appointments.filter((app) => app.status === "paid").length === 0 ? (
            <p className="text-secondary fst-italic">No pending approvals.</p>
          ) : (
            <ListGroup variant="flush">
              {appointments
                .filter((app) => app.status === "paid")
                .map((appointment) => (
                  <ListGroup.Item
                    key={appointment._id}
                    className="d-flex justify-content-between align-items-center bg-dark text-light p-3 mb-2 rounded"
                  >
                    <div>
                      <strong>{appointment.userId.username}</strong> <br />
                      <small className="text-secondary">
                        {appointment.userId.email}
                      </small>
                    </div>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => approveAppointment(appointment._id)}
                    >
                      Approve
                    </Button>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Appointments
