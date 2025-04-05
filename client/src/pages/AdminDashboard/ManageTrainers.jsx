import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ManageTrainers() {
  const [trainers, setTrainers] = useState([]);
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

  if (loading) return <p className="text-center mt-5">Loading trainers...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manage Trainers</h2>

      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-bordered text-white" style={{ backgroundColor: "#1e1e1e" }}>
            <thead style={{ backgroundColor: "#333", color: "#f4a825" }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Approve</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <tr key={trainer._id}>
                  <td>{trainer.username}</td>
                  <td>{trainer.email}</td>
                  <td>{trainer.specialization}</td>
                  <td>
                    {trainer.verified ? (
                      <span className="badge bg-success">Approved</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                  </td>
                  <td>
                    {!trainer.verified && (
                      <button className="btn btn-primary btn-sm" onClick={() => approveTrainer(trainer._id)}>
                        Approve
                      </button>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteTrainer(trainer._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-md-none">
        {trainers.map((trainer) => (
          <div key={trainer._id} className="card mb-3 shadow" style={{ backgroundColor: "#2c2c2c", color: "#fff" }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: "#f4a825" }}>{trainer.username}</h5>
              <p><strong>Email:</strong> {trainer.email}</p>
              <p><strong>Specialization:</strong> {trainer.specialization}</p>
              <p><strong>Status:</strong> {trainer.verified ? (
                <span className="badge bg-success">Approved</span>
              ) : (
                <span className="badge bg-warning text-dark">Pending</span>
              )}</p>
              <div className="d-flex gap-2 flex-wrap">
                {!trainer.verified && (
                  <button className="btn btn-primary btn-sm" onClick={() => approveTrainer(trainer._id)}>
                    Approve
                  </button>
                )}
                <button className="btn btn-danger btn-sm" onClick={() => deleteTrainer(trainer._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageTrainers;
