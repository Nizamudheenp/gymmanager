import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./Components.css";
import logoimg from "../../src/assets/gyfit-logo.png";

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="privacy-page-container">
            <nav className="navbar-custom" id="homepage-navbar">
                <motion.div
                    className="nav-logo"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                >
                    <img src={logoimg} alt="GYFIT" />
                </motion.div>
                <Nav className="nav-links-centered">
                    <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/about">About</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/contact">Contact</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/login" className="login-link-btn">Login</Nav.Link></Nav.Item>
                </Nav>

                <button className="mobile-menu-toggle" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
            </nav>

            <div className={`sidebar-overlay ${isSidebarOpen ? "visible" : ""}`} onClick={toggleSidebar}></div>
            <div className={`mobile-sidebar ${isSidebarOpen ? "open" : ""}`}>
                <button className="sidebar-close" onClick={toggleSidebar}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="sidebar-links">
                    <a href="/" className="sidebar-link" onClick={toggleSidebar}>Home</a>
                    <a href="/about" className="sidebar-link" onClick={toggleSidebar}>About Us</a>
                    <a href="/contact" className="sidebar-link" onClick={toggleSidebar}>Contact Us</a>
                    <a href="/privacy" className="sidebar-link" onClick={toggleSidebar}>Privacy Policy</a>
                    <hr style={{ border: "0.5px solid rgba(255,255,255,0.1)", margin: "10px 0" }} />
                    <a href="/login" className="sidebar-link" style={{ color: "#ff8c00" }} onClick={toggleSidebar}>Login</a>
                </div>
                <div className="sidebar-footer">
                    <p style={{ fontSize: "0.8rem", color: "#666" }}>GYFIT © 2026</p>
                </div>
            </div>


            <motion.section
                className="privacy-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="hero-content">
                    <h1>Privacy <span>Policy</span></h1>
                    <p>Your privacy is our priority. Learn how we handle your data with care and transparency.</p>
                </div>
            </motion.section>

            <section className="privacy-content">
                <div className="privacy-grid">
                    <motion.div
                        className="privacy-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>1. Information We Collect</h2>
                        <p>
                            To provide you with the best fitness experience, we collect certain information:
                        </p>
                        <ul>
                            <li><strong>Account Details:</strong> Your name and email address when you register.</li>
                            <li><strong>Fitness Logs:</strong> Workout data, weight tracking, and nutritional logs that you choose to input.</li>
                            <li><strong>Trainer Interactions:</strong> Details of your bookings and sessions with our expert trainers.</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="privacy-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2>2. How We Use Your Data</h2>
                        <p>We use your information strictly for fitness-related purposes:</p>
                        <ul>
                            <li>To personalize your dashboard and track your progress over time.</li>
                            <li>To facilitate easy scheduling between you and your trainers.</li>
                            <li>To send important updates about your account or new features.</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="privacy-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2>3. Data Security</h2>
                        <p>
                            We implement robust security measures to protect your data. Your fitness logs and personal information are stored securely and are only accessible to you and (if you choose) your assigned trainers.
                        </p>
                    </motion.div>

                    <motion.div
                        className="privacy-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2>4. Your Rights</h2>
                        <p>
                            You have full control over your data. You can view, edit, or delete your fitness logs at any time through your dashboard. If you wish to close your account, all associated personal data will be removed from our active systems.
                        </p>
                    </motion.div>

                    <motion.div
                        className="privacy-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2>5. Simplified Terms</h2>
                        <p>
                            In short: your data is yours. We don't sell your information to third-party advertisers. We only use it to help you get fitter and more organized.
                        </p>
                    </motion.div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-logo">
                        <img src={logoimg} alt="GYFIT Logo" />
                        <h3><span>GYFIT</span></h3>
                        <p>Empowering your fitness journey — track, train, and transform with precision and passion.</p>
                    </div>

                    <div className="footer-column">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <a href="/">Home</a>
                            <a href="/login">Login</a>
                            <a href="/#features">Features</a>
                            <a href="/about">About</a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Explore</h4>
                        <div className="footer-links">
                            <a href="/about">Our Story</a>
                            <a href="/contact">Contact Us</a>
                            <a href="/privacy">Privacy Policy</a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Support</h4>
                        <div className="footer-links">
                            <a href="/contact">Help Center</a>
                            <a href="/contact">Contact Support</a>
                            <a href="/privacy">User Rights</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} GYFIT. All rights reserved. Designed for excellence.</p>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
