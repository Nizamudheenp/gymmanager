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
        toast.success("Failed to fetch reviews");

      } finally {
        setFetchingReviews(false);
      }
    };
    fetchReviews();
  }, [trainerId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return alert("Rating must be between 1 and 5");
    if (!comment.trim()) return alert("Comment cannot be empty");

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/review/${trainerId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("review added");
      setRating(0);
      setComment("");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/getreviews/${trainerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 text-dark">
      <h3>Trainer Reviews</h3>
      <p>Average Rating: ⭐ {averageRating}/5</p>

      <form onSubmit={handleReviewSubmit} className="mb-4">
        <div className="mb-2">
          <label>Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label>Comment</label>
          <textarea
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-warning" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <h5>All Reviews</h5>
      {fetchingReviews ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="list-group">
          {reviews.map((review) => (
            <li key={review._id} className="list-group-item bg-dark text-white border-light">
              <strong>{review.userId.name}</strong> ⭐ {review.rating}/5
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TrainerReviews;
