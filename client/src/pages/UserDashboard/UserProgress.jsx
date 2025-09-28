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
       const sortedResponse = response.data.progress.sort((a,b)=> new Date(b.loggedAt) - new Date(a.loggedAt))
        setProgress(sortedResponse.slice(0,5));
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
    <div className="container mt-4">
      <Card className="p-4 shadow-sm bg-dark text-white">
        <h2 style={{ color: "#ff8c00", textAlign:"center"}}>Track Your Progress</h2>
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Weight (kg):</Form.Label>
            <Form.Control
              type="number"
              className="py-3"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Body Fat %:</Form.Label>
            <Form.Control
              type="number"
              className="py-3"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              placeholder="Enter body fat percentage"
              required
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button
            type="submit"
            style={{ background: "#ff8c00", border:"0"}}
            className="w-100 py-3"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Log Progress"}
          </Button>
        </Form>

        <h3 style={{ color: "#ff8c00", marginTop:"20px", marginBottom:"20px"}}>Progress History</h3>
        {progress.length > 0 ? (
          <ul className="list-group mt-1">
            {progress.map((entry) => (
              <li
                key={entry._id}
                className="list-group-item d-flex justify-content-between align-items-center bg-secondary text-white p-3"
              >
                <div>
                  <strong>{entry.weight} kg</strong> | Body Fat: {entry.bodyFat}% | BMI: {entry.bmi} | Muscle Mass: {entry.muscleMass} kg
                </div>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => handleDelete(entry._id)}
                  disabled={deleteLoading === entry._id}
                >
                  {deleteLoading === entry._id ? <Spinner animation="border" size="sm" /> : "Delete"}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mt-2">No progress logged yet.</p>
        )}
      </Card>
    </div>
  );
}

export default UserProgress;
