import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { motion, AnimatePresence } from "framer-motion";
import "./Components.css";
import logoimg from "../../src/assets/gyfit-logo.png";

function HomePage() {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const testimonials = [
    { text: "This platform changed my fitness routine! Highly recommend it.", author: "Aslam M." },
    { text: "Booking a trainer has never been easier. Love the UI!", author: "Sarah K." },
    { text: "I was able to lose 10kg in 3 months with the help of this system!", author: "Rajiv P." },
    { text: "Clean, simple and powerful. It keeps me consistent every week.", author: "Jasmiin D." },
  ];

  const faqData = [
    { q: "Can I cancel anytime?", a: "Yes, you can cancel or switch plans anytime without any hidden charges." },
    { q: "Do trainers provide diet plans?", a: "Absolutely! Our certified trainers provide both personalized workout and comprehensive nutrition guidance tailored to your goals." },
    { q: "Is there a mobile app?", a: "GYFIT is fully mobile-optimized, so you can track your progress on the go. A dedicated mobile app is also in development!" },
    { q: "How do I book a session?", a: "Once you're logged in, head to the trainers section, choose your preferred expert, and pick a time slot that fits your schedule." },
    { q: "How can I contact my trainer for doubts?", a: "We have an integrated messaging system! Once you book a trainer, you can chat with them directly through your dashboard for any queries or guidance." },
    { q: "How do I track my fitness progress?", a: "GYFIT provides a comprehensive dashboard where you can log your workouts, track your weight, and see visual progress charts over time." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <>
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
          <Nav.Item><Nav.Link href="#features">Features</Nav.Link></Nav.Item>
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
          <a href="/#features" className="sidebar-link" onClick={toggleSidebar}>Features</a>
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


      <motion.div
        className="homepage-mainview p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fade-in">Level Up Your Fitness with
          <br /> <span>GYFIT</span></h1>
        <p className="fade-in delay-1">Track your fitness, book trainers, and manage your progress.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="get-started-btn mt-4 pulse"
          onClick={() => navigate("/what-brings-you-here")}
        >
          Get Started
        </motion.button>
      </motion.div>

      {/*  About */}
      <motion.section
        className="about-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ amount: 0.1, once: true }}
      >
        <h2>The GYFIT Advantage</h2>
        <p>
          We're more than just a gym manager. We're your partner in health, providing the tools and community support you need to reach your peak performance.
        </p>

        <div className="aboutList">
          <ul className="about-benefits">
            {[
              "Real-time Personal Dashboards",
              "Expert Virtual Coaching",
              "Precision Nutrition Tracking",
              "Dynamic Community Challenges"
            ].map((benefit, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {benefit}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.section>


      <motion.section
        id="features"
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ amount: 0.1, once: true }}
      >
        <h2>Our Key Features</h2>
        <div className="features-container">
          {[
            { title: "Track Progress", desc: "Visualize growth with dynamic graphs, workout logs, and milestones" },
            { title: " Personal Training", desc: "Certified trainers create personalized workout plans" },
            { title: "Nutrition Management", desc: "Log meals, track macros, and maintain balance" },
            { title: "Secure Payments", desc: "Book sessions with secure online payments" },
            { title: "Smart Scheduling", desc: "Sync trainer sessions with your calendar easily" },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="feature-box"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: false }}
            >
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="trainer-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ amount: 0.1, once: true }}
      >
        <h2>Meet Our Expert Trainers</h2>
        <div className="trainers-container">
          {[
            { name: "Gopi Krishnan", spec: "Strength & Conditioning" },
            { name: "Amal Johnson", spec: "HIIT & Cardio Expert" },
            { name: "Rahul Sharma", spec: "Yoga & Mindfulness Coach" },
            { name: "Aslam Muhammed", spec: "Functional Training & Nutrition" }
          ].map((t, i) => (
            <motion.div
              key={i}
              className="trainer-card"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <h3>{t.name}</h3>
              <p>{t.spec}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Pricing Plans */}
      <motion.section id="pricing" className="pricing-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ amount: 0.1, once: true }}>
        <h2>Choose Your Plan</h2>
        <div className="pricing-container">
          {[
            { plan: "Basic", price: "₹0/m", features: ["Workout Logs", "Basic Nutrition", "Community Support"] },
            { plan: "Pro", price: "₹199/m", features: ["Everything in Basic", "Trainer Access", "Advanced Tracking"] },
            { plan: "Elite", price: "₹399/m", features: ["Everything in Pro", "1-on-1 Sessions", "Priority Support"] },
          ].map((p, i) => (
            <motion.div key={i} className="pricing-card" whileHover={{ scale: 1.01 }}>
              <h3>{p.plan}</h3>
              <h4>{p.price}</h4>
              <ul>
                {p.features.map((f, idx) => <li key={idx}>{f}</li>)}
              </ul>
              <button
                className="get-started-btn"
                onClick={() => setShowPopup(true)}
              >
                Select Plan
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <section className="how-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <motion.div className="step-card" whileHover={{ scale: 1.01 }}>
            <span>1</span><h3>Sign Up</h3><p>Create your free account and set your fitness goals.</p>
          </motion.div>
          <motion.div className="step-card" whileHover={{ scale: 1.01 }}>
            <span>2</span><h3>Choose Plan</h3><p>Select from affordable plans tailored to your needs.</p>
          </motion.div>
          <motion.div className="step-card" whileHover={{ scale: 1.01 }}>
            <span>3</span><h3>Start Training</h3><p>Book trainers, follow plans, and track your journey.</p>
          </motion.div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial-slider">
          {testimonials.map((t, i) => (
            <div key={i} className={`testimonial ${i === activeIndex ? "active" : ""}`}>
              <p>"{t.text}"</p>
              <h4>- {t.author}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <motion.section id="faq" className="faq-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ amount: 0.1, once: true }}>
        <h2>Got Questions?</h2>
        <div className="faq-list">
          {faqData.map((faq, i) => (
            <motion.div
              key={i}
              layout
              className={`faq-item ${activeFaq === i ? "active" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <h4>{faq.q}</h4>
                <span className="faq-icon">{activeFaq === i ? "−" : "+"}</span>
              </div>
              <AnimatePresence initial={false}>
                {activeFaq === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="faq-answer-wrapper"
                  >
                    <div className="faq-answer-content">
                      <p>{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className="cta-section">
        <h2>Ready to Transform Your Life?</h2>
        <p>Join thousands of members who trust GYFIT for their fitness journey.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="get-started-btn"
          onClick={() => navigate("/what-brings-you-here")}
        >
          Join Now
        </motion.button>
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
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
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


      {/* Modal */}
      {showPopup && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            className="popup-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Coming Soon</h2>
            <p>Our advanced planning system is on the way. Stay tuned!</p>
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </motion.div>
        </motion.div>
      )}

    </>
  );
}

export default HomePage;
