import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

function Fitnessgoals() {
  const [goals, setGoals] = useState([]);
  const [goalType, setGoalType] = useState("")
  const [targetProgress, setTargetProgress] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchGoals()
  }, [token])

  const fetchGoals = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/getgoals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sortedGoals = response.data.goals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setGoals(sortedGoals.slice(0, 5));
    } catch (error) {
      setError("Failed to fetch goals.");
    }
    setLoading(false);
  };


  const setGoal = async () => {
    if (!goalType || !targetProgress || targetProgress <= 0 || !endDate) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/setgoal`,
        { goalType, targetProgress, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGoals();
      setGoalType("");
      setTargetProgress("");
      setEndDate("");
      toast.success("Goal set successfully");
      setError("")
    } catch (error) {
      setError("Failed to set goal.");
    }
    setLoading(false);
  };


  const deleteGoal = async (goalId) => {
    setLoading(true);
    setError("");
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/deletegoal/${goalId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
    } catch (error) {
      setError("Failed to delete goal.");
    }
    setLoading(false);
  };

  const updateProgress = async (goalId, currentProgress) => {
    setLoading(true);
    setError("");
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/updategoal/${goalId}`,
        { currentprogress: currentProgress },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchGoals()
    } catch (error) {
      if (error.response?.data?.message === "You can only update progress once per day.") {
        toast.error("You can only update progress once per day.");
      } else {
        setError("Error updating goal", error.message);
      }
    }
    setLoading(false);

  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">

          {error && (
            <div className="alert alert-danger border-0 bg-dark text-danger rounded-3 shadow-sm mb-4" style={{ borderLeft: "4px solid #dc3545" }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
            </div>
          )}

          <div className="card shadow-lg border-0 position-relative overflow-hidden mb-4"
            style={{
              background: "rgba(25, 25, 25, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
            }}
          >
            {/* Top Minimal Accent */}
            <div
              className="position-absolute top-0 start-0 w-100"
              style={{ height: "3px", background: "#ff8c00" }}
            />

            <div className="card-body p-4 p-md-5 z-1 position-relative">
              <div className="text-center mb-5">
                <h2 className="text-white fw-bold mb-1">Fitness Goals</h2>
                <p className="text-secondary mb-0">Set your targets and start crushing them</p>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="text-secondary small text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px" }}>Goal Type</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none"
                    placeholder="Goal Type (e.g., Run 5km)"
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    style={{ padding: "14px 16px", borderRadius: "8px" }}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="text-secondary small text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px" }}>Target</label>
                  <input
                    type="number"
                    className="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none"
                    placeholder="Target (e.g., 30 days)"
                    value={targetProgress}
                    onChange={(e) => setTargetProgress(e.target.value)}
                    style={{ padding: "14px 16px", borderRadius: "8px" }}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="text-secondary small text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px" }}>End Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ padding: "14px 16px", borderRadius: "8px" }}
                  />
                </div>
                <div className="col-12 mt-4">
                  <button
                    className="btn w-100 fw-bold border-0 shadow-sm"
                    disabled={loading}
                    style={{
                      backgroundColor: "#ff8c00",
                      color: "#000",
                      padding: "14px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 140, 0, 0.3)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    onClick={setGoal}
                  >
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-dark" role="status"><span className="visually-hidden">Loading...</span></div>
                    ) : (
                      <><i className="bi bi-flag-fill me-2"></i>Set Goal</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
            <h4 className="text-white fw-bold mb-0">Current Goals</h4>
            <span className="badge rounded-pill fw-bold" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff" }}>
              {goals.length} Active
            </span>
          </div>

          {goals.length === 0 ? (
            <div className="text-center p-5 rounded-4" style={{ background: "rgba(25, 25, 25, 0.4)", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <i className="bi bi-trophy opacity-50" style={{ fontSize: "3rem", color: "#ffffff" }}></i>
              <p className="text-secondary mt-3 mb-0 fs-5">No fitness goals set yet.</p>
              <p className="text-secondary small mt-1">Add your first goal above to start tracking.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {goals.map((goal) => {
                const progressPercentage = Math.min(100, Math.round((goal.currentprogress / goal.targetProgress) * 100));
                const isCompleted = progressPercentage >= 100;

                return (
                  <div key={goal._id} className="card border-0 shadow-sm overflow-hidden"
                    style={{
                      background: "rgba(25, 25, 25, 0.6)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "16px",
                    }}
                  >
                    <div className="card-body p-4">
                      <Row className="align-items-center g-3">
                        <Col xs={12} sm={8} className="d-flex flex-column">
                          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                            <h5 className="text-white fw-bold mb-0">{goal.goalType}</h5>
                            <span
                              className={`badge rounded-pill px-3 py-1 fw-bold text-uppercase`}
                              style={{
                                backgroundColor: isCompleted ? "rgba(40, 167, 69, 0.1)" : "rgba(255, 255, 255, 0.05)",
                                color: isCompleted ? "#28a745" : "rgba(255, 255, 255, 0.6)",
                                border: `1px solid ${isCompleted ? "rgba(40, 167, 69, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                                fontSize: "0.65rem",
                                letterSpacing: "0.5px"
                              }}
                            >
                              {isCompleted ? "Completed" : "In Progress"}
                            </span>
                          </div>

                          <div className="text-secondary small d-flex flex-column gap-1">
                            <span><i className="fa-solid fa-calendar-check me-1"></i> Target: {new Date(goal.endDate).toLocaleDateString()}</span>
                            <span>
                              Progress: <span className="fw-bold text-white">{goal.currentprogress} / {goal.targetProgress}</span>
                            </span>
                          </div>
                        </Col>

                        <Col xs={12} sm={4} className="d-flex justify-content-start justify-content-sm-end align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            {!isCompleted && (
                              <button
                                className="btn btn-sm d-flex align-items-center justify-content-center shadow-sm border-0"
                                style={{
                                  background: "rgba(255, 140, 0, 0.1)",
                                  color: "#ff8c00",
                                  borderRadius: "8px",
                                  width: "38px",
                                  height: "38px",
                                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                }}
                                onClick={() => updateProgress(goal._id, goal.currentprogress + 1)}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "rgba(255, 140, 0, 0.25)";
                                  e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "rgba(255, 140, 0, 0.1)";
                                  e.currentTarget.style.transform = "scale(1)";
                                }}
                                title="Update progress"
                              >
                                <i className="fa-solid fa-plus font-weight-bold"></i>
                              </button>
                            )}
                            <button
                              className="btn btn-sm d-flex align-items-center justify-content-center shadow-sm border-0"
                              onClick={() => deleteGoal(goal._id)}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "rgba(220, 53, 69, 0.25)";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "rgba(220, 53, 69, 0.1)";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                              title="Delete goal"
                              style={{
                                background: "rgba(220, 53, 69, 0.1)",
                                color: "#dc3545",
                                borderRadius: "8px",
                                width: "38px",
                                height: "38px",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                              }}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </Col>
                      </Row>

                      {/* Custom Progress Bar */}
                      <div className="position-relative mt-4" style={{ height: '8px', background: "rgba(255, 255, 255, 0.1)", borderRadius: "10px" }}>
                        <div
                          className="position-absolute h-100 top-0 start-0"
                          style={{
                            width: `${progressPercentage}%`,
                            background: isCompleted ? "#28a745" : "#ff8c00",
                            borderRadius: "10px",
                            transition: "width 0.5s ease"
                          }}
                        />
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <small className="text-secondary fw-bold">0%</small>
                        <small className="fw-bold" style={{ color: isCompleted ? "#28a745" : "#ff8c00" }}>{progressPercentage}%</small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Fitnessgoals;
