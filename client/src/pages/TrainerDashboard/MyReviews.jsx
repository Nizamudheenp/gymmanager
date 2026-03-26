import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Spinner, Card, Container, Badge, Row, Col } from "react-bootstrap";
import { FaStar, FaQuoteLeft, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";


function MyReviews() {
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState(0)
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem("token")

    useEffect(() => {
        fetchReviews()
    }, [])
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trainer/myreviews`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setReviews(response.data.reviews || [])
            setAverageRating(response.data.averageRating || 0)
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false)
        }
    }

    const renderStars = (rating) => {
        return (
            <div className="d-flex gap-1" style={{ color: "#ff8c00" }}>
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        style={{
                            opacity: i < Math.floor(rating) ? 1 : 0.2,
                            filter: i < Math.floor(rating) ? 'drop-shadow(0 0 5px rgba(255,140,0,0.5))' : 'none'
                        }}
                    />
                ))}
            </div>
        );
    };

    if (loading) return (
        <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-white-50">Loading your feedback journey...</p>
        </div>
    );

    return (
        <Container className="pt-2 mt-5">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 mb-5 border-white-10 text-start position-relative overflow-hidden shadow-lg"
            >
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(90deg, rgba(255,140,0,0.08) 0%, transparent 40%)', zIndex: 0 }}></div>
                <div className="position-relative" style={{ zIndex: 1, paddingLeft: '10px' }}>
                    <h5 className="text-white-50 small text-uppercase fw-bold mb-3 ls-2">Overall Performance</h5>
                    <div className="d-flex align-items-center gap-5 flex-wrap">
                        <div className="display-4 fw-bold text-white mb-0" style={{ textShadow: '0 0 25px rgba(255,140,0,0.4)', fontSize: '3.5rem' }}>
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="text-start border-start border-white-10 ps-4">
                            {renderStars(averageRating)}
                            <p className="text-white-50 small mb-0 mt-2 fw-semibold">Based on {reviews.length} total client reviews</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="d-flex align-items-center justify-content-between mb-4 px-1">
                <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-2 ls-1 font-orbitron">
                    Client Feedback
                </h4>
                <Badge bg="warning-subtle" className="text-warning px-3 py-2 border border-warning-20 fw-bold">ALL REVIEWS</Badge>
            </div>

            {reviews.length === 0 ? (
                <div className="glass-card p-5 text-center border-dashed">
                    <p className="text-white-50 mb-0 italic">No reviews yet. Your legacy starts here!</p>
                </div>
            ) : (
                <div className="review-stack d-flex flex-column gap-4 mb-5">
                    <AnimatePresence>
                        {reviews.slice().reverse().map((review, index) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="glass-card-review border-0 overflow-hidden">
                                    <Card.Body className="p-0">
                                        <Row className="g-0 align-items-stretch">
                                            <Col md={4} lg={3} className="p-4 bg-white-2 border-end border-white-5">
                                                <div className="d-flex flex-column align-items-start gap-4 h-100">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="reviewer-avatar">
                                                            {review.userId?.username?.charAt(0).toUpperCase() || "C"}
                                                        </div>
                                                        <div className="reviewer-meta">
                                                            <h6 className="text-white fw-bold mb-0 text-truncate" style={{ maxWidth: '100px' }}>{review.userId?.username || "Anonymous"}</h6>
                                                            <Badge bg="transparent" className="p-0 text-white-50 fw-normal" style={{ fontSize: '0.65rem' }}>Verified Trainee</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="mt-auto">
                                                        <div className="text-white-50 small mb-2 ls-1 fw-bold opacity-30">RATING</div>
                                                        <div className="star-badge px-2 py-1 bg-dark-50 rounded-pill d-inline-block border border-white-10">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={8} lg={9} className="p-4 position-relative">
                                                <FaQuoteLeft className="position-absolute text-warning opacity-10" style={{ right: '40px', bottom: '20px', fontSize: '4.5rem', pointerEvents: 'none' }} />
                                                <div className="review-comment-box h-100 d-flex flex-column">
                                                    <div className="text-white-50 small mb-3 ls-1 fw-bold opacity-30">CLIENT COMMENT</div>
                                                    <p className="text-white-85 mb-0 fst-italic position-relative" style={{ lineHeight: '1.8', fontSize: '1.05rem', minHeight: '60px' }}>
                                                        "{review.comment}"
                                                    </p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .ls-2 { letter-spacing: 2px; }
                .text-white-85 { color: rgba(255, 255, 255, 0.85); }
                .bg-white-2 { background: rgba(255, 255, 255, 0.02); }
                .border-white-5 { border-color: rgba(255, 255, 255, 0.05) !important; }
                .border-white-10 { border-color: rgba(255, 255, 255, 0.1) !important; }
                .glass-card-review {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.06) !important;
                    border-radius: 20px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .glass-card-review:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 140, 0, 0.2) !important;
                    transform: translateX(10px);
                    box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.5);
                }
                .reviewer-avatar {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, rgba(255, 140, 0, 0.3), #ff4500);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    font-weight: 800;
                    font-size: 1.3rem;
                    box-shadow: 0 0 20px rgba(255, 140, 0, 0.4);
                }
                .border-dashed { border-style: dashed !important; border-color: rgba(255,255,255,0.1) !important; }
                .border-warning-20 { border-color: rgba(255, 140, 0, 0.2) !important; }
                @media (max-width: 768px) {
                    .border-end { border-end: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
                    .reviewer-avatar { width: 40px; height: 40px; font-size: 1rem; }
                }
            `}</style>
        </Container>
    )
}

export default MyReviews