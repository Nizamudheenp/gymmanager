import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Container, Alert } from "react-bootstrap";

function ManageFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/getfeedbacks`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setFeedbacks(response.data || []);
        } catch (error) {
            console.log("Error fetching feedbacks:", error);
            setError("Failed to load feedbacks. Please try again.");
        }
    };

    const deleteFeedback = async (reviewId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/delete-feedback/${reviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setFeedbacks((prev) => prev.filter((review) => review._id !== reviewId));
        } catch (error) {
            console.log("Error deleting feedback:", error);
            setError("Failed to delete feedback. Please try again.");
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-golden mb-4 text-center">Manage Trainer Feedbacks</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {feedbacks.length === 0 ? (
                <Alert variant="warning" className="text-center fw-bold">
                    No feedbacks available.
                </Alert>
            ) : (
                <Table striped bordered hover responsive className="custom-table">
                    <thead>
                        <tr>
                            <th> Username</th>
                            <th> Email</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((review) => (
                            <tr key={review._id}>
                                <td>{review.username}</td>
                                <td>{review.email}</td>
                                <td className="text-golden fw-bold">{review.rating} ⭐</td>
                                <td>{review.comment || "No comment"}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => deleteFeedback(review._id)}>
                                        Delete
                                    </Button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default ManageFeedbacks;
