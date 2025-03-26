import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Card } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

function HomeReviewWidget() {
  const [latestReview, setLatestReview] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/myreviews`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const reviews = response.data.reviews || [];
      setAverageRating(response.data.averageRating);
      setLatestReview(reviews.length > 0 ? reviews[reviews.length - 1] : null);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4 text-warning" />;

  return (
    <Card className="bg-dark text-white shadow-lg p-4">
      <h4 className="text-warning text-center">
        Trainer Reviews <FaStar className="text-warning" />
      </h4>
      <p className="text-center text-light">
        ⭐ Average Rating: {averageRating.toFixed(1)}/5
      </p>

      {latestReview ? (
        <Card className="bg-secondary text-white p-2">
          <Card.Body>
            <Card.Title>
              <strong>{latestReview.userId?.username || "User"}</strong> ⭐ {latestReview.rating}/5
            </Card.Title>
            <Card.Text>"{latestReview.comment}"</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <p className="text-white text-center">No reviews yet.</p>
      )}
    </Card>
  );
}

export default HomeReviewWidget;
