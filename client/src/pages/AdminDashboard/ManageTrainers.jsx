import React, { useEffect, useState } from "react";
import axios from "axios";

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
    const conformApprove = window.confirm("Are you sure you want to approve this user as trainer?");
    if (!conformApprove) return; 
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/approvetrainer/${trainerId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTrainers(trainers.map(trainer =>
        trainer._id === trainerId ? { ...trainer, verified: true } : trainer
      ));
    } catch (error) {
      setError("Failed to approve trainers.");
      setLoading(false);
    }
  };
  
  const deleteTrainer = async (trainerId) =>{
    const confirmDelete = window.confirm("Are you sure you want to delete this trainer?");
    if (!confirmDelete) return; 
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/deletetrainer/${trainerId}`,{
        headers: { Authorization: `Bearer ${token}` },
      })
      setTrainers(prevTrainers => prevTrainers.filter(trainer => trainer._id !== trainerId));
    } catch (error) {
      setError("Failed to delete trainer.");
      setLoading(false);
    }
  }

  if (loading) return <p>Loading trainers...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center">Manage Trainers</h2>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Status</th>
            <th>pending verification</th>
            <th>delete trainer</th>
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
                  <span className="badge bg-warning">Pending</span>
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
                {trainer && (
                  <button className="btn btn-danger btn-sm" onClick={()=> deleteTrainer(trainer._id)}>
                  delete
                </button>
                )}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageTrainers;
