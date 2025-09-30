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
      {workouts.length === 0 ? (
        <p className="text-secondary">No workouts assigned yet.</p>
      ) : (
        <ul className="list-group">
          {workouts.map((workout) => (
            <li key={workout._id} className="list-group-item bg-dark text-light p-4">
              <strong style={{ color: "#ff8c00"}}>Assigned by : {workout.trainerId.username}</strong>
              <p className='mt-2'>
                Status : {" "}
                <span className={workout.status === "completed" ? "text-success fw-bold" : "text-warning fw-bold"}>
                  {workout.status}
                </span>
              </p>
              <ul className="ps-3">
                {workout.exercises.map((exercise, idx) => (
                  <li key={exercise._id || idx} className="text-light">
                    {exercise.name} - <span className="text-warning">{exercise.sets} sets x {exercise.reps} reps</span>
                  </li>
                ))}
              </ul>
              {workout.status !== "completed" && (
                <button
                  className="btn btn-warning btn-sm mt-2 fw-bold text-dark"
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