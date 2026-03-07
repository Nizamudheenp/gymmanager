import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { toast } from "react-toastify";
import "./Components.css";
import logoimg from "../../src/assets/gyfit-logo.png";

const ContactUs = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user type
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Please enter a valid email address";
            }
        }
        if (!formData.message.trim()) newErrors.message = "Message is required";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
        toast.success("Message sent successfully!");
    };

    return (
        <div className="contact-page-container">
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
                className="contact-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="hero-content">
                    <h1>Get in <span>Touch</span></h1>
                    <p>Have questions or need assistance? Our team is here to help you on your fitness journey.</p>
                </div>
            </motion.section>

            <section className="contact-main">
                <div className="contact-grid">
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Contact Us</h2>
                        <p>For urgent inquiries or direct feedback, reach out via email:</p>
                        <a href="mailto:nzmp.dev@gmail.com" className="contact-email-link">nzmp.dev@gmail.com</a>

                        <div className="contact-additional-info">
                            <h3>Support Hours</h3>
                            <p>Monday - Friday: 9am - 6pm</p>
                            <p>Saturday: 10am - 4pm</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="contact-form-container"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {submitted ? (
                            <motion.div
                                className="success-message-box"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <h3>Thank You!</h3>
                                <p>Your message has been received. We'll get back to you shortly.</p>
                                <button className="get-started-btn" onClick={() => setSubmitted(false)}>Send Another</button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name <span className="required-star">*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="your name"
                                        className={errors.name ? "input-error" : ""}
                                    />
                                    {errors.name && <span className="error-text">{errors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address <span className="required-star">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your email"
                                        className={errors.email ? "input-error" : ""}
                                    />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Your Message <span className="required-star">*</span></label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="how can we help you?"
                                        rows="5"
                                        className={errors.message ? "input-error" : ""}
                                    ></textarea>
                                    {errors.message && <span className="error-text">{errors.message}</span>}
                                </div>
                                <button type="submit" className="get-started-btn">Send Message</button>
                            </form>
                        )}
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

export default ContactUs;
