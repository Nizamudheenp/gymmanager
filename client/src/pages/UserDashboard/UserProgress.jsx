import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Form, Alert, Spinner } from "react-bootstrap";

function UserProgress() {
  const [progress, setProgress] = useState([]);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/getprogress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sortedResponse = response.data.progress.sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt))
        setProgress(sortedResponse.slice(0, 5));
      } catch (err) {
        console.error("Error fetching progress:", err.response?.data?.message || err.message);
      }
    };
    fetchProgress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/logprogress`,
        { weight, bodyFat },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProgress(prevProgress => {
        const updatedProgress = [response.data.progress.slice(-1)[0], ...prevProgress];
        return updatedProgress.slice(0, 5);
      });
      setWeight("");
      setBodyFat("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log progress");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (progressId) => {
    setDeleteLoading(progressId);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/deleteprogress/${progressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProgress(progress.filter((entry) => entry._id !== progressId));
    } catch (err) {
      console.error("Failed to delete progress:", err.response?.data?.message || err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-lg border-0 position-relative overflow-hidden mb-5"
            style={{
              background: "rgba(25, 25, 25, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
            }}
          >
            {/* Top Minimal Accent */}
            <div className="position-absolute top-0 start-0 w-100" style={{ height: "3px", background: "#ff8c00" }} />

            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-5">
                <h2 className="text-white fw-bold mb-1">Track Your Transformation</h2>
                <p className="text-secondary mb-0">Record your physical metrics and watch your journey unfold</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <Form.Group>
                      <Form.Label className="text-secondary small text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px" }}>Weight (kg)</Form.Label>
                      <Form.Control
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="e.g., 75.5"
                        required
                        className="bg-dark text-white border-secondary border-opacity-25 shadow-none"
                        style={{ padding: "14px 16px", borderRadius: "8px" }}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-12 col-md-6">
                    <Form.Group>
                      <Form.Label className="text-secondary small text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px" }}>Body Fat %</Form.Label>
                      <Form.Control
                        type="number"
                        value={bodyFat}
                        onChange={(e) => setBodyFat(e.target.value)}
                        placeholder="e.g., 18.5"
                        required
                        className="bg-dark text-white border-secondary border-opacity-25 shadow-none"
                        style={{ padding: "14px 16px", borderRadius: "8px" }}
                      />
                    </Form.Group>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-4 mb-0 border-0 bg-dark text-danger rounded-3" style={{ borderLeft: "4px solid #dc3545" }}>
                    <i className="fa-solid fa-triangle-exclamation me-2"></i> {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-100 fw-bold mt-4 border-0 shadow-sm"
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
                >
                  {loading ? <Spinner animation="border" size="sm" /> : <><i className="fa-solid fa-chart-line me-2"></i>Log Progress</>}
                </Button>
              </Form>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
            <h4 className="text-white fw-bold mb-0">Progress History</h4>
            <span className="badge rounded-pill fw-bold" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff" }}>
              Last 5 Entries
            </span>
          </div>

          {progress.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {progress.map((entry) => (
                <div key={entry._id} className="card border-0 shadow-sm"
                  style={{
                    background: "rgba(25, 25, 25, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px",
                  }}
                >
                  <div className="card-body p-4">
                    <div className="row align-items-center g-3">
                      <div className="col-12 col-sm-8">
                        <div className="d-flex flex-wrap gap-4 align-items-center">
                          <div className="text-center">
                            <div className="text-secondary small text-uppercase mb-1" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>Weight</div>
                            <div className="text-white fw-bold fs-5">{entry.weight} <small className="text-secondary fw-normal">kg</small></div>
                          </div>
                          <div className="vr bg-secondary opacity-25 d-none d-sm-block" style={{ height: "40px" }} />
                          <div className="text-center">
                            <div className="text-secondary small text-uppercase mb-1" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>Body Fat</div>
                            <div className="text-white fw-bold fs-5">{entry.bodyFat} <small className="text-secondary fw-normal">%</small></div>
                          </div>
                          <div className="vr bg-secondary opacity-25 d-none d-md-block" style={{ height: "40px" }} />
                          <div className="text-center d-none d-md-block">
                            <div className="text-secondary small text-uppercase mb-1" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>Date</div>
                            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>{new Date(entry.loggedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-sm-4 d-flex justify-content-start justify-content-sm-end align-items-center">
                        <Button
                          variant="outline-danger"
                          className="btn-sm border-0 d-flex align-items-center justify-content-center"
                          style={{ 
                            borderRadius: "8px", 
                            background: "rgba(220, 53, 69, 0.1)", 
                            width: "38px", 
                            height: "38px",
                            transition: "all 0.3s ease" 
                          }}
                          onClick={() => handleDelete(entry._id)}
                          disabled={deleteLoading === entry._id}
                          onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = "rgba(220, 53, 69, 0.2)"; }}
                          onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(220, 53, 69, 0.1)"; }}
                        >
                          {deleteLoading === entry._id ? <Spinner animation="border" size="sm" /> : <i className="fa-solid fa-trash-can"></i>}
                        </Button>
                      </div>
                    </div>

                    <div className="row mt-3 g-2">
                      <div className="col-4">
                        <div className="bg-dark p-2 rounded-2 text-center" style={{ background: "rgba(0,0,0,0.2) !important", border: "1px solid rgba(255,255,255,0.03)" }}>
                          <span className="text-secondary xx-small d-block mb-1" style={{ fontSize: "0.6rem" }}>BMI</span>
                          <span className="text-white fw-bold" style={{ fontSize: "0.85rem" }}>{entry.bmi}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-dark p-2 rounded-2 text-center" style={{ background: "rgba(0,0,0,0.2) !important", border: "1px solid rgba(255,255,255,0.03)" }}>
                          <span className="text-secondary xx-small d-block mb-1" style={{ fontSize: "0.6rem" }}>MUSCLE</span>
                          <span className="text-white fw-bold" style={{ fontSize: "0.85rem" }}>{entry.muscleMass}kg</span>
                        </div>
                      </div>
                      <div className="col-4 d-md-none">
                        <div className="bg-dark p-2 rounded-2 text-center" style={{ background: "rgba(0,0,0,0.2) !important", border: "1px solid rgba(255,255,255,0.03)" }}>
                          <span className="text-secondary xx-small d-block mb-1" style={{ fontSize: "0.6rem" }}>DATE</span>
                          <span className="text-white fw-bold" style={{ fontSize: "0.75rem" }}>{new Date(entry.loggedAt).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-5 rounded-4" style={{ background: "rgba(25, 25, 25, 0.4)", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <i className="fa-solid fa-gauge-high opacity-50" style={{ fontSize: "3rem", color: "#ffffff" }}></i>
              <p className="text-secondary mt-3 mb-0 fs-5">No metrics recorded yet.</p>
              <p className="text-secondary small mt-1">Start your tracking journey by adding your metrics above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProgress;
