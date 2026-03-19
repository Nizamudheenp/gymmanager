import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner, Modal, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaSearch, FaTrash, FaUsers, FaDumbbell, FaCalendarAlt, FaUserTie, FaEye, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

function AdminManageSessions() {
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [bookedUsers, setBookedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/allsessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/deletesession/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      toast.success("Session deleted successfully!");
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session.");
    }
  };

  const handleViewBookedUsers = async (sessionId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/sessionbookings/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookedUsers(response.data.bookings);
      setSelectedSession(sessionId);
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to fetch booked users.");
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.trainerId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.workoutType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
     return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-1 text-white">Session Management</h2>
          <p className="text-white-50 m-0">Monitor and moderate gym training sessions.</p>
        </div>
        <div className="search-container position-relative">
          <FaSearch className="position-absolute top-50 start-3 translate-middle-y text-white-50" style={{ left: '15px' }} />
          <input 
            type="text" 
            className="search-input ps-5" 
            placeholder="Search sessions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-4">
        <AnimatePresence>
          {filteredSessions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-12 text-center py-5 text-white-50 fst-italic">
              No sessions found.
            </motion.div>
          ) : (
            filteredSessions.map((session, idx) => (
              <motion.div 
                key={session._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="col-12 col-md-6 col-lg-4"
              >
                <div className="management-card h-100 overflow-hidden">
                  <div className="position-relative" style={{ height: '160px' }}>
                    <img 
                      src={session.image || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"} 
                      alt={session.sessionName}
                      className="w-100 h-100 object-fit-cover opacity-75"
                    />
                    <div className="position-absolute top-0 end-0 p-3">
                        {session.status === "available" ? (
                          <span className="badge rounded-pill bg-success bg-opacity-25 text-success border border-success border-opacity-25 backdrop-blur px-3 py-1"><FaCheckCircle className="me-1" /> Available</span>
                        ) : (
                          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-25 backdrop-blur px-3 py-1"><FaExclamationCircle className="me-1" /> {session.status}</span>
                        )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="text-white mb-1">{session.sessionName}</h5>
                        <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 text-xs">{session.workoutType}</span>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <small className="text-white-50 text-uppercase d-block tracking-tighter">Trainer</small>
                        <span className="text-white text-sm"><FaUserTie className="me-2 text-warning" />{session.trainerId?.username || "Unknown"}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-white-50 text-uppercase d-block tracking-tighter">Date & Time</small>
                        <span className="text-white text-sm"><FaCalendarAlt className="me-2 text-info" />{new Date(session.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-white-50 text-uppercase d-block tracking-tighter">Capacity</small>
                        <span className="text-white text-sm"><FaUsers className="me-2 text-success" />{session.bookings.filter(b => b.status === "approved").length} / {session.maxParticipants}</span>
                      </div>
                    </div>

                    <div className="d-flex gap-2 pt-3 border-top border-white-10 mt-auto">
                      <button 
                        className="btn btn-sm btn-outline-primary border-0 d-flex align-items-center gap-2" 
                        onClick={() => handleViewBookedUsers(session._id)}
                      >
                        <FaEye /> Bookings
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger border-0 d-flex align-items-center gap-2 ms-auto" 
                        onClick={() => handleDeleteSession(session._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Booked Users Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="management-card border-white-10 shadow-2xl" backdrop="static">
        <Modal.Header closeButton closeVariant="white" className="border-white-10 bg-black bg-opacity-75">
          <Modal.Title className="text-white">Session Participants</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-black bg-opacity-90">
          {bookedUsers.length === 0 ? (
            <div className="p-5 text-center text-white-50">No users booked for this session.</div>
          ) : (
            <div className="list-group list-group-flush">
              {bookedUsers.map((user) => (
                <div key={user.userId._id} className="list-group-item bg-transparent text-white border-white-10 py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{user.userId.username}</h6>
                    <small className="text-white-50">{user.userId.email}</small>
                  </div>
                  <span className={`badge rounded-pill ${user.status === 'approved' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-uppercase text-xs tracking-wider px-3`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminManageSessions;
