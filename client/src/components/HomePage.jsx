import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { motion } from "framer-motion";
import "./Components.css";
import logoimg from "../../src/assets/gyfit-logo.jpg";

function HomePage() {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const testimonials = [
    { text: "This platform changed my fitness routine! Highly recommend it.", author: "Alex M." },
    { text: "Booking a trainer has never been easier. Love the UI!", author: "Sarah K." },
    { text: "I was able to lose 10kg in 3 months with the help of this system!", author: "Rajiv P." },
    { text: "Clean, simple and powerful. It keeps me consistent every week.", author: "Meera D." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar-custom" id="homepage-navbar">
        <div className="nav-logo">
          <img src={logoimg} alt="GYMFIT" />
        </div>
        <Nav>
          <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="/login">Login</Nav.Link></Nav.Item>
        </Nav>
      </nav>

      <motion.div
        className="homepage-mainview p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fade-in">Welcome to <span>GYFIT</span> fitness tracker</h1>
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

      {/*  About Section */}
      <motion.section
        className="about-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Why Choose Our Fitness Management System?</h2>
        <p>Designed for both beginners and pros, GYFIT simplifies every part of your fitness journey.</p>
        <div className="aboutList">
          <ul className="about-benefits">
            <li>✅ Easy-to-use dashboard with real-time updates</li>
            <li>✅ Access expert trainers and book sessions online</li>
            <li>✅ Comprehensive tracking for progress and nutrition</li>
            <li>✅ Affordable plans with premium support</li>
          </ul>
        </div>
      </motion.section>

      {/*  Features Section */}
      <motion.section
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2>Our Key Features</h2>
        <div className="features-container">
          {[
            { title: "📊 Track Progress", desc: "Visualize growth with dynamic graphs, workout logs, and milestones" },
            { title: "🏋️‍♂️ Personal Training", desc: "Certified trainers create personalized workout plans" },
            { title: "🍎 Nutrition Management", desc: "Log meals, track macros, and maintain balance" },
            { title: "💳 Secure Payments", desc: "Book sessions with secure online payments" },
            { title: "📅 Smart Scheduling", desc: "Sync trainer sessions with your calendar easily" },
            { title: "📱 Mobile Friendly", desc: "Access your dashboard on any device, anytime" },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="feature-box glow"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/*  NEW Trainer Spotlight */}
      <motion.section
        className="trainer-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2>Meet Our Expert Trainers</h2>
        <div className="trainers-container">
          {["Emily Johnson", "David Lee", "Sophia Patel"].map((t, i) => (
            <motion.div
              key={i}
              className="trainer-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="trainer-img"></div>
              <h3>{t}</h3>
              <p>Specialist in Strength, Cardio & Nutrition</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/*  NEW Pricing Plans */}
      <motion.section className="pricing-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
        <h2>Choose Your Plan</h2>
        <div className="pricing-container">
          {[
            { plan: "Basic", price: "$9/mo", features: ["Workout Logs", "Basic Nutrition", "Community Support"] },
            { plan: "Pro", price: "$29/mo", features: ["Everything in Basic", "Trainer Access", "Advanced Tracking"] },
            { plan: "Elite", price: "$49/mo", features: ["Everything in Pro", "1-on-1 Sessions", "Priority Support"] },
          ].map((p, i) => (
            <motion.div key={i} className="pricing-card" whileHover={{ scale: 1.08 }}>
              <h3>{p.plan}</h3>
              <h4>{p.price}</h4>
              <ul>
                {p.features.map((f, idx) => <li key={idx}>✅ {f}</li>)}
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

      {/* How It Works Section */}
      <section className="how-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <motion.div className="step-card" whileHover={{ scale: 1.05 }}>
            <span>1</span><h3>Sign Up</h3><p>Create your free account and set your fitness goals.</p>
          </motion.div>
          <motion.div className="step-card" whileHover={{ scale: 1.05 }}>
            <span>2</span><h3>Choose Plan</h3><p>Select from affordable plans tailored to your needs.</p>
          </motion.div>
          <motion.div className="step-card" whileHover={{ scale: 1.05 }}>
            <span>3</span><h3>Start Training</h3><p>Book trainers, follow plans, and track your journey.</p>
          </motion.div>
        </div>
      </section>

      {/*  Testimonials */}
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

      {/*  NEW FAQ Section */}
      <motion.section className="faq-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {[
            { q: "Can I cancel anytime?", a: "Yes, you can cancel or switch plans anytime." },
            { q: "Do trainers provide diet plans?", a: "Yes, our trainers provide both workout and nutrition guidance." },
            { q: "Is there a mobile app?", a: "GYFIT is fully mobile-friendly and an app is coming soon!" },
          ].map((faq, i) => (
            <motion.div key={i} className="faq-item" whileHover={{ scale: 1.02 }}>
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/*  CTA Section */}
      <section className="cta-section">
        <h2>Ready to Transform Your Life?</h2>
        <p>Join thousands of members who trust GYFIT for their fitness journey.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="get-started-btn glow"
          onClick={() => navigate("/what-brings-you-here")}
        >
          Join Now
        </motion.button>
      </section>

      {/*  Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Fitness Management System. All rights reserved.</p>
          <nav>
            <a href="/">Home</a> | <a href="/login">Login</a>
          </nav>
        </div>
      </footer>

      {/*  Popup Modal */}
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
            <h2>🚧 Coming Soon 🚧</h2>
            <p>Our advanced planning system is on the way. Stay tuned!</p>
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </motion.div>
        </motion.div>
      )}

    </>
  );
}

export default HomePage;
