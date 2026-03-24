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
      <div className="d-flex align-items-center justify-content-between mb-4 px-1">
        <div>
          <h6 className="text-white fw-bold mb-0">Trainer Rating</h6>
          <small className="text-white-50">Client performance index</small>
        </div>
        <div className="text-end">
          <div className="text-white fw-bold fs-5 mb-1" style={{ textShadow: '0 0 10px rgba(255,140,0,0.3)' }}>
            {averageRating.toFixed(1)} <span className="text-white-50 fs-6">/ 5</span>
          </div>
          {renderStars(averageRating)}
        </div>
      </div>

      {latestReview ? (
        <div className="latest-review-mini-card">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center gap-2">
                <div className="mini-avatar">
                    {latestReview.userId?.username?.charAt(0).toUpperCase() || "C"}
                </div>
                <div>
                    <div className="text-white fw-bold small">{latestReview.userId?.username || "Guest User"}</div>
                    <div className="text-warning-subtle" style={{ fontSize: '0.65rem', fontWeight: '800' }}>LATEST FEEDBACK</div>
                </div>
            </div>
            {renderStars(latestReview.rating)}
          </div>
          <p className="mb-0 review-text-mini">
            "{latestReview.comment}"
          </p>
        </div>
      ) : (
        <div className="text-center p-4 glass-card border-dashed">
          <p className="mb-0 text-white-50 small">No feedback records found.</p>
        </div>
      )}

      <style>{`
        .latest-review-mini-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-left: 3px solid #ff8c00;
            border-radius: 12px;
            padding: 16px;
            transition: all 0.3s ease;
        }
        .latest-review-mini-card:hover {
            background: rgba(255, 255, 255, 0.06);
            transform: translateY(-2px);
        }
        .mini-avatar {
            width: 32px;
            height: 32px;
            background: rgba(255, 140, 0, 0.1);
            border: 1px solid rgba(255, 140, 0, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ff8c00;
            font-weight: 700;
            font-size: 0.8rem;
        }
        .review-text-mini {
            font-style: italic;
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .border-dashed { border-style: dashed !important; border-color: rgba(255,255,255,0.1) !important; }
      `}</style>
    </div>
  );
}

export default HomeReviewWidget;
