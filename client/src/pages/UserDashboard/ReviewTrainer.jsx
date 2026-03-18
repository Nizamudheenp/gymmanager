import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


function TrainerReviews() {
  const { trainerId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingReviews, setFetchingReviews] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReviews();
  }, [trainerId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/getreviews/${trainerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setFetchingReviews(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return toast.warning("Rating must be between 1 and 5");
    if (!comment.trim()) return toast.warning("Comment cannot be empty");

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/review/${trainerId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review added successfully");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`fa-star ${i < count ? 'fa-solid text-warning' : 'fa-regular text-secondary'}`} style={{ fontSize: "0.8rem" }}></i>
    ));
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="card shadow-lg border-0 position-relative overflow-hidden mb-5"
            style={{
              background: "rgba(25, 25, 25, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
            }}
          >
            <div className="position-absolute top-0 start-0 w-100" style={{ height: "3px", background: "#ff8c00" }} />

            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-5">
                <h2 className="text-white fw-bold mb-1">Trainer Reviews</h2>
                <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
                  <span className="text-warning fw-bold fs-4">{averageRating || 0}</span>
                  <div className="d-flex gap-1">
                    {renderStars(Math.round(averageRating || 0))}
                  </div>
                  <span className="text-secondary small">({reviews.length} reviews)</span>
                </div>
              </div>

              <form onSubmit={handleReviewSubmit} className="mb-5 p-4 rounded-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <h5 className="text-white fw-bold mb-4">Share Your Experience</h5>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <label className="text-secondary small text-uppercase fw-bold mb-2">Your Rating</label>
                    <div className="d-flex align-items-center bg-dark p-2 rounded-3 border border-secondary border-opacity-25">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="form-control bg-transparent border-0 text-white shadow-none text-center fw-bold"
                        style={{ fontSize: "1.2rem" }}
                        placeholder="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                      />
                      <i className="fa-solid fa-star text-warning me-2"></i>
                    </div>
                  </div>
                  <div className="col-12 col-md-8">
                    <label className="text-secondary small text-uppercase fw-bold mb-2">Comment</label>
                    <textarea
                      className="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none"
                      rows="3"
                      placeholder="What was it like training with this coach?"
                      style={{ borderRadius: "12px", padding: "12px" }}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn w-100 fw-bold mt-4 py-3 shadow-lg border-0"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #ff8c00 0%, #ff5e00 100%)",
                    color: "#000",
                    borderRadius: "12px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 140, 0, 0.4)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fa-solid fa-paper-plane me-2"></i>}
                  {loading ? "Posting..." : "Submit Review"}
                </button>
              </form>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainerReviews;
