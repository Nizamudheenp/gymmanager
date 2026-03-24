import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch, FaTrash, FaCheck, FaUserTie, FaEnvelope, FaFilter, FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

function ManageTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/gettrainers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainers(response.data.trainers);
        setLoading(false);
      } catch (error) {
        setError("Failed to load trainers.");
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [token]);

  const approveTrainer = async (trainerId) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this trainer?");
    if (!confirmApprove) return;
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/approvetrainer/${trainerId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainers(prev =>
        prev.map(t => (t._id === trainerId ? { ...t, verified: true } : t))
      );
      toast.success("Trainer approved successfully.");
    } catch (error) {
      setError("Failed to approve trainer.");
      toast.error("Approval failed.");
    }
  };

  const deleteTrainer = async (trainerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trainer?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/deletetrainer/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainers(prev => prev.filter(trainer => trainer._id !== trainerId));
      toast.success("Trainer deleted successfully.");
    } catch (error) {
      setError("Failed to delete trainer.");
      toast.error("Deletion failed.");
    }
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" ||
      (filterStatus === "verified" && trainer.verified) ||
      (filterStatus === "pending" && !trainer.verified);
    return matchesSearch && matchesFilter;
  });

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
          <h2 className="mb-1 text-white">Trainer Management</h2>
          <p className="text-white-50 m-0">Oversee staff and professional certifications.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap flex-grow-1 justify-content-end" style={{ maxWidth: '600px' }}>
          <div className="search-container position-relative mb-0 flex-grow-1">
            <FaSearch className="position-absolute top-50 start-3 translate-middle-y text-white-50" style={{ left: '15px' }} />
            <input
              type="text"
              className="search-input ps-5"
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="position-relative" style={{ minWidth: '180px' }}>
            <FaFilter className="position-absolute text-warning" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <select
              className="search-input ps-5 bg-dark text-white border-white-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <AnimatePresence>
          {filteredTrainers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-12 text-center py-5 text-white-50 fst-italic"
            >
              No trainers found matching your criteria.
            </motion.div>
          ) : (
            filteredTrainers.map((trainer, idx) => (
              <motion.div
                key={trainer._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="col-12"
              >
                <div className="management-card p-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="user-avatar text-uppercase" style={{ background: 'linear-gradient(135deg, #8a2be2 0%, #4b0082 100%)' }}>
                        {trainer.username.charAt(0)}
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h5 className="m-0 text-white">{trainer.username}</h5>
                          {trainer.verified ? (
                            <span className="badge rounded-pill bg-success-subtle text-success border border-success border-opacity-25 text-xs">Verified</span>
                          ) : (
                            <span className="badge rounded-pill bg-warning-subtle text-warning border border-warning border-opacity-25 text-xs">Pending</span>
                          )}
                        </div>
                        <p className="text-white-50 text-sm m-0"><FaEnvelope className="me-2" />{trainer.email}</p>
                      </div>
                    </div>

                    <div className="flex-grow-1 border-start border-white-10 ps-4 d-none d-lg-block">
                      <small className="d-block text-white-50 text-uppercase tracking-wider">Specialization</small>
                      <span className="text-white"><FaStar className="text-warning me-2" />{trainer.specialization || "General Fitness"}</span>
                    </div>

                    <div className="d-flex gap-2">
                      {!trainer.verified && (
                        <button
                          className="btn btn-primary btn-sm px-2 py-1 text-xs rounded"
                          onClick={() => approveTrainer(trainer._id)}
                        >
                          <FaCheck className="me-1" /> Approve
                        </button>
                      )}
                      <button
                        className="btn btn-outline-danger btn-sm px-2 py-1 text-xs rounded border-white-10"
                        onClick={() => deleteTrainer(trainer._id)}
                      >
                        <FaTrash className="me-1 " /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ManageTrainers;
