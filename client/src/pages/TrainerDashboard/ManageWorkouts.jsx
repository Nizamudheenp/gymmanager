import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ManageWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const token = localStorage.getItem("token");
  const { userId } = useParams();

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/getuserworkouts/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkouts(response.data.workouts || []);
    } catch (error) {
    }
  };
  
  useEffect(() => {
    fetchWorkouts();
  }, [userId, token]);

  // Assign workout
  const assignWorkout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/assignworkouts`,
        { userId, exercises: [{ name: exercise, sets, reps }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExercise("");
      setSets("");
      setReps("");

      fetchWorkouts(); // Refresh the list after assignment
    } catch (error) {
      console.error("Error assigning workout:", error.response?.data?.message || error.message);
    }
  };

  // Delete workout
  const deleteWorkout = async (exerciseId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/deleteworkout/${exerciseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchWorkouts(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting exercise:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Manage Workouts</h4>

      {/* Assign New Workout */}
      <div className="card p-3">
        <h5>Assign New Workout</h5>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Exercise"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <button className="btn btn-success w-100" onClick={assignWorkout}>
          Assign Workout
        </button>
      </div>

      <h5 className="mt-4">Current Workouts</h5>
{workouts.length === 0 ? (
  <p>No workouts assigned yet.</p>
) : (
  <ul className="list-group">
    {workouts.map((exercise) => (  // No need to check for exercises array, it's a flat structure
      <li key={exercise._id} className="list-group-item d-flex justify-content-between">
        {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
        <button className="btn btn-danger btn-sm" onClick={() => deleteWorkout(exercise._id)}>
          Delete
        </button>
      </li>
    ))}
  </ul>
)}

    </div>
  );
}

export default ManageWorkouts;
