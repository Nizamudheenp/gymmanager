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
      {trainers.map((trainer) => (
        <div
          key={trainer._id}
          className="card mb-3 shadow-sm p-3"
          style={{
            backgroundColor: "#2c2c2c",
            color: "#fff",
          }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h5 className="card-title mb-3" style={{ color: "#ff8c00" }}>
                  {trainer.username}
                </h5>
                <p className="mb-1">
                  <strong>Email : </strong> {trainer.email}
                </p>
                <p className="mb-1">
                  <strong>Specialization : </strong> {trainer.specialization}
                </p>
                <p className="mb-0">
                  <strong>Status : </strong>{" "}
                  {trainer.verified ? (
                    <span className="badge bg-success">Approved</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Pending</span>
                  )}
                </p>
              </div>

              <div className="d-flex gap-2 mt-3 mt-md-0">
                {!trainer.verified && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => approveTrainer(trainer._id)}
                  >
                    Approve
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTrainer(trainer._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManageTrainers;
