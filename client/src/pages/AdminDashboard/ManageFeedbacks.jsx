import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";

function ManageFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/getfeedbacks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFeedbacks(response.data || []);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setError("Failed to load feedbacks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [token]);

  const deleteFeedback = async (reviewId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/delete-feedback/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedbacks((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setError("Failed to delete feedback. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="warning" />
        <p className="text-light mt-2">Loading feedbacks...</p>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      {error && <Alert variant="danger">{error}</Alert>}

      {feedbacks.length === 0 ? (
        <Alert variant="warning" className="text-center fw-bold">
          No feedbacks available.
        </Alert>
      ) : (
        <div className="d-flex flex-wrap justify-content-between">
          {feedbacks.map((review) => (
            <Card
              key={review._id}
              className="m-3 p-3 shadow"
              style={{
                backgroundColor: "#2c2c2c",
                color: "#fff",
                width: "320px",
                border: "1px solid #444",
                borderRadius: "10px",
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "#ff8c00" , marginBottom:"10px" }}>
                  {review.username}
                </Card.Title>
                <Card.Subtitle className="mb-2">
                  {review.email}
                </Card.Subtitle>

                <p className="mt-3 mb-1">
                  <strong>Rating : </strong>{" "}
                  <span className="fw-bold text-warning">{review.rating} ⭐</span>
                </p>
                <p className="mb-3">
                  <strong>Comment : </strong> {review.comment || "No comment"}
                </p>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteFeedback(review._id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

export default ManageFeedbacks;
