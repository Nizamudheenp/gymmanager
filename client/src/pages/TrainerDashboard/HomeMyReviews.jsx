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

  const renderStars = (rating) => {
    return (
      <div className="d-flex" style={{ color: "#ff8c00", gap: "2px" }}>
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} style={{ opacity: i < Math.floor(rating) ? 1 : 0.2 }} />
        ))}
      </div>
    );
  };

  if (loading) return <div className="text-center p-4"><Spinner animation="border" className="text-warning" /></div>;

  return (
    <div className="w-100">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <div style={{ color: "#fff", fontWeight: "700", fontSize: "1.1rem" }}>Average Rating</div>
          <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.85rem" }}>Based on your performance</div>
        </div>
        <div className="text-end">
          <div style={{ fontSize: "1.2rem", color: "#fff", fontWeight: "700" }}>{averageRating.toFixed(1)} / 5</div>
          {renderStars(averageRating)}
        </div>
      </div>

      {latestReview ? (
        <div style={{ background: "rgba(255, 140, 0, 0.03)", borderRadius: "12px", padding: "18px", borderLeft: "4px solid #ff8c00" }}>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <div style={{ color: "#fff", fontWeight: "600", fontSize: "0.95rem" }}>{latestReview.userId?.username || "Guest User"}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)" }}>Latest feedback</div>
            </div>
            {renderStars(latestReview.rating)}
          </div>
          <p className="mb-0" style={{ fontStyle: "italic", fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.6" }}>
            "{latestReview.comment}"
          </p>
        </div>
      ) : (
        <div className="text-center p-4" style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "12px", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
          <p className="mb-0" style={{ opacity: 0.5, fontSize: "0.85rem" }}>No client reviews yet.</p>
        </div>
      )}
    </div>
  );
}

export default HomeReviewWidget;
