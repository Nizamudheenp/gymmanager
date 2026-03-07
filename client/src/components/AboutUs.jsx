import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./Components.css";
import logoimg from "../../src/assets/gyfit-logo.png";

const AboutUs = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="about-page-container">
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
                className="about-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="hero-content">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Elevating <span>Fitness</span> Together
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        GYFIT is more than just a management system; it's a comprehensive platform designed to bridge the gap between fitness enthusiasts and expert trainers.
                    </motion.p>
                </div>
            </motion.section>

            <section className="about-details">
                <div className="details-grid">
                    <motion.div
                        className="detail-card"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to empower individuals to achieve their health goals through seamless technology. We provide tools that track progress, simplify trainer booking, and offer personalized nutrition management—all in a single, intuitive interface.
                        </p>
                    </motion.div>

                    <motion.div
                        className="detail-card"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Why We Exist</h2>
                        <p>
                            In a world full of complex fitness apps, GYFIT stands out by focusing on what truly matters: consistency and expert guidance. We believe that by making the administrative part of fitness effortless, you can focus 100% on your transformation.
                        </p>
                    </motion.div>
                </div>
            </section>

            <motion.section
                className="about-vision"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2>The Future of Training</h2>
                <p>
                    From real-time weight tracking to smart session scheduling, we are constantly evolving. Our platform handles the secondary tasks so our expert trainers can provide the primary value—getting you results.
                </p>
            </motion.section>

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
                            <a href="#features">Features</a>
                            <a href="#pricing">Plans</a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Explore</h4>
                        <div className="footer-links">
                            <a href="/about">About Us</a>
                            <a href="/contact">Contact Us</a>
                            <a href="/login">Get Started</a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Company</h4>
                        <div className="footer-links">
                            <a href="/about">Our Story</a>
                            <a href="/contact">Support</a>
                            <a href="/privacy">Privacy Policy</a>
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

export default AboutUs;
