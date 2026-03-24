import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaTrash, FaUser, FaEnvelope, FaRulerVertical, FaWeight, FaRunning } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        setError("Failed to load users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/deleteuser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      toast.success("User deleted successfully.");
    } catch (error) {
      setError("Failed to delete user.");
      toast.error("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="mb-1 text-white">User Management</h2>
          <p className="text-white-50 m-0">Oversee and manage gym members.</p>
        </div>
        <div className="search-container position-relative">
          <FaSearch className="position-absolute top-50 start-3 translate-middle-y text-white-50" style={{ left: '15px' }} />
          <input 
            type="text" 
            className="search-input ps-5" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-danger mb-4">{error}</div>}

      <div className="row g-4">
        <AnimatePresence>
          {filteredUsers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-12 text-center py-5 text-white-50 fst-italic"
            >
              No members found matching your search.
            </motion.div>
          ) : (
            filteredUsers.map((user, idx) => (
              <motion.div 
                key={user._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="col-12"
              >
                <div className="management-card p-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="user-avatar text-uppercase">
                        {user.username.charAt(0)}
                      </div>
                      <div>
                        <h5 className="mb-1 text-white">{user.username}</h5>
                        <p className="text-white-50 text-sm m-0"><FaEnvelope className="me-2" />{user.email}</p>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-4 px-3 border-start border-end border-white-10 d-none d-md-flex">
                      <div className="text-center">
                        <small className="d-block text-white-50 text-uppercase tracking-wider">Height</small>
                        <span className="text-white"><FaRulerVertical className="text-warning me-1" /> {user.fitnessData?.height || "N/A"}</span>
                      </div>
                      <div className="text-center">
                        <small className="d-block text-white-50 text-uppercase tracking-wider">Weight</small>
                        <span className="text-white"><FaWeight className="text-info me-1" /> {user.fitnessData?.weight || "N/A"}</span>
                      </div>
                      <div className="text-center">
                        <small className="d-block text-white-50 text-uppercase tracking-wider">Frequency</small>
                        <span className="text-white"><FaRunning className="text-success me-1" /> {user.fitnessData?.exerciseFrequency || "N/A"}</span>
                      </div>
                    </div>

                    <div>
                      <button
                        className="btn btn-outline-danger btn-sm border-0 d-flex align-items-center gap-2"
                        onClick={() => deleteUser(user._id)}
                      >
                        <FaTrash /> <span className="d-none d-sm-inline">Remove</span>
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

export default ManageUsers;
