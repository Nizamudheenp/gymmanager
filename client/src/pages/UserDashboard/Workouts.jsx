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
      <h2 className="text-white mb-4 fw-bold" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)"}}>
        <i className="bi bi-activity text-warning me-2 opacity-75"></i>My Workouts
      </h2>
      
      {workouts.length === 0 ? (
        <div className="text-center p-5 rounded-4" style={{ background: "rgba(25, 25, 25, 0.4)", border: "1px dashed rgba(255,140,0,0.2)" }}>
          <i className="bi bi-clipboard-x opacity-50" style={{ fontSize: "3rem", color: "#ff8c00" }}></i>
          <p className="text-secondary mt-3 mb-0 fs-5">No workouts assigned yet.</p>
        </div>
      ) : (
        <div className="row g-4 mt-1">
          {workouts.map((workout) => (
            <div key={workout._id} className="col-12 col-lg-6">
              <div className="card h-100 border-0 shadow-lg position-relative overflow-hidden" 
                style={{ 
                  background: "rgba(20, 20, 20, 0.8)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.05) !important",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                }}
              >
                {/* Status Indicator Bar */}
                <div 
                  className="position-absolute top-0 start-0 w-100" 
                  style={{ 
                    height: "3px", 
                    background: workout.status === "completed" ? "#ff8c00" : "rgba(255, 140, 0, 0.3)"
                  }}
                />
                
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h5 className="text-white fw-bold mb-1">Assigned by {workout.trainerId.username}</h5>
                      <div className="d-inline-flex align-items-center mt-2 px-3 py-1 rounded-pill" 
                        style={{ 
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <span style={{ 
                          width: "6px", height: "6px", borderRadius: "50%", 
                          background: workout.status === "completed" ? "#ff8c00" : "rgba(255, 140, 0, 0.4)",
                          marginRight: "8px"
                        }} />
                        <span className={`fw-bold ${workout.status === "completed" ? "text-white" : "text-secondary"}`} style={{ fontSize: "0.80rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                          {workout.status}
                        </span>
                      </div>
                    </div>
                    <div className="rounded p-2 bg-dark border border-secondary border-opacity-25 text-center" style={{ minWidth: "60px"}}>
                      <div className="text-white fw-bold fs-5">{workout.exercises.length}</div>
                      <div className="text-secondary" style={{ fontSize: "0.7rem", textTransform: "uppercase"}}>Exercises</div>
                    </div>
                  </div>

                  <div className="flex-grow-1 bg-dark rounded-3 p-3 border border-secondary border-opacity-10 mb-4">
                    <ul className="list-unstyled mb-0">
                      {workout.exercises.map((exercise, idx) => (
                        <li key={exercise._id || idx} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light border-opacity-10 last-child-no-border">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-play-fill text-secondary me-2"></i>
                            <span className="text-light fw-medium">{exercise.name}</span>
                          </div>
                          <div className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25 px-2 py-1">
                            <span className="text-white fw-bold">{exercise.sets}</span> sets × <span className="text-white fw-bold">{exercise.reps}</span> reps
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {workout.status !== "completed" ? (
                    <button
                      className="btn w-100 fw-bold py-3 mt-auto rounded-3"
                      style={{
                        background: "linear-gradient(45deg, #e67e22, #f39c12)",
                        border: "none",
                        color: "#fff",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        boxShadow: "0 4px 15px rgba(243, 156, 18, 0.4)",
                        transition: "all 0.3s ease"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(243, 156, 18, 0.6)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(243, 156, 18, 0.4)"; }}
                      onClick={() => markAsCompleted(workout._id)}
                    >
                      <i className="bi bi-check2-circle me-2 fs-5 align-middle"></i>
                      Mark as Completed
                    </button>
                  ) : (
                    <div className="text-center mt-auto py-3 rounded-3" 
                      style={{ 
                        background: "rgba(255, 255, 255, 0.02)", 
                        border: "1px dashed rgba(255, 140, 0, 0.3)"
                      }}>
                      <span className="text-white fw-bold" style={{ letterSpacing: "0.5px" }}>
                        <i className="bi bi-check2-all me-2 text-warning opacity-75"></i> Workout Completed!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .last-child-no-border:last-child { border-bottom: none !important; margin-bottom: 0 !important; padding-bottom: 0 !important; }
      `}</style>
    </div>

  )
}

export default UserWorkouts