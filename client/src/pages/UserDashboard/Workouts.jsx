import React, { useEffect, useState } from 'react'
import axios from "axios";

function UserWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserWorkouts();
  }, [token]);

  const fetchUserWorkouts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/getworkouts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error("Error fetching workouts:", error.response?.data?.message || error.message);
    }
  };

  const markAsCompleted = async (workoutId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/updatestatus/${workoutId}`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }

      )

      setWorkouts((prevWorkouts) => prevWorkouts.map((workout) => workout.id === workoutId ? { ...workout, status: "completed" } : workout))

    } catch (error) {
      console.error("Error updating workout status:", error.response?.data?.message || error.message);

    }
  }
  return (
    <div className="container mt-4">
            <h4>My Workouts</h4>
            {workouts.length === 0 ? (
                <p>No workouts assigned yet.</p>
            ) : (
                <ul className="list-group">
                    {workouts.map((workout) => (
                        <li key={workout._id} className="list-group-item">
                            <strong>Assigned by: {workout.trainerId.username}</strong>
                            <p>Status: <span className={workout.status === "completed" ? "text-success" : "text-warning"}>{workout.status}</span></p>
                            <ul>
                                {workout.exercises.map((exercise, idx) => (
                                    <li key={exercise._id || idx}>
                                        {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
                                    </li>
                                ))}
                            </ul>
                            {workout.status !== "completed" && (
                                <button
                                    className="btn btn-sm btn-success mt-2"
                                    onClick={() => markAsCompleted(workout._id)}
                                >
                                    Mark as Completed
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
  )
}

export default UserWorkouts