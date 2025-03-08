import axios from 'axios';
import React, { useEffect, useState } from 'react'

function ManageUsers() {
  const [users,setUsers]=useState([])
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
        setError("Failed to load trainers.");
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [token]);

  const deleteUser = async (userId) =>{
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return; 
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/deleteuser/${userId}`,{
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (error) {
      setError("Failed to delete user.");
      setLoading(false);
    }
  }


  
  if (loading) return <p>Loading trainers...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center">Manage Users</h2>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Fitness Data</th>
            <th>delete user</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>height : {user.fitnessData.height} <br></br>
                  wieght : {user.fitnessData.weight} <br></br>
                  exerciseFrequency : {user.fitnessData.exerciseFrequency}
              </td>
              <td>
                {user && (
                  <button className="btn btn-danger btn-sm" onClick={()=> deleteUser(user._id)}>
                  delete
                </button>
                )}    
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageUsers