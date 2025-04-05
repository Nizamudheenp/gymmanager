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
      <h2 className="text-center mb-4">Manage Users</h2>

      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-bordered text-white" style={{ backgroundColor: "#1e1e1e" }}>
            <thead style={{ backgroundColor: "#333", color: "#f4a825" }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Fitness Data</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    Height: {user.fitnessData?.height}<br />
                    Weight: {user.fitnessData?.weight}<br />
                    Frequency: {user.fitnessData?.exerciseFrequency}
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user._id)}>
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
        {users.map((user) => (
          <div key={user._id} className="card mb-3 shadow" style={{ backgroundColor: "#2c2c2c", color: "#fff" }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: "#f4a825" }}>{user.username}</h5>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Height:</strong> {user.fitnessData?.height}<br />
                <strong>Weight:</strong> {user.fitnessData?.weight}<br />
                <strong>Frequency:</strong> {user.fitnessData?.exerciseFrequency}
              </p>
              <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageUsers;
