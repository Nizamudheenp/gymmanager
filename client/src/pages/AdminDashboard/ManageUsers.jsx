import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function ManageUsers() {
  const [users, setUsers] = useState([]);
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

  if (loading) return <p className="text-center mt-5">Loading users...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
     <div className="container mt-5">

      {users.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          No users found.
        </p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="card mb-3 shadow-sm border-0 p-3"
            style={{
              backgroundColor: "#2c2c2c",
              color: "#fff",
              borderRadius: "10px",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h5 className="card-title mb-2" style={{ color: "#ff8c00" }}>
                    {user.username}
                  </h5>
                  <p className="mb-1">
                    <strong>Email:</strong> {user.email}
                  </p>
                  {user.fitnessData ? (
                    <>
                      <p className="mb-1">
                        <strong>Height:</strong> {user.fitnessData.height}
                      </p>
                      <p className="mb-1">
                        <strong>Weight:</strong> {user.fitnessData.weight}
                      </p>
                      <p className="mb-0">
                        <strong>Exercice Frequency:</strong>{" "}
                        {user.fitnessData.exerciseFrequency}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted fst-italic mb-0">
                      No fitness data available.
                    </p>
                  )}
                </div>

                <div className="mt-3 mt-md-0">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageUsers;
