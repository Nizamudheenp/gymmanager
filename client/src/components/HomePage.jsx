import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import "./Components.css";
import logoimg from "../../src/assets/gyfit-logo.jpg"


function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar-custom" id='homepage-navbar'>
        <div className='nav-logo'>
          <img src={logoimg} alt="GYMFIT" />
        </div>
        <Nav>
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav.Item>
        </Nav>
      </nav>

      <div className="homepage-mainview p-3">
        <h1>Welcome to <span>GYFIT</span> fitness tracker</h1>
        <p>Track your fitness, book trainers, and manage your progress.</p>

        <button className="get-started-btn mt-4" onClick={() => navigate("/what-brings-you-here")}>
          Get Started
        </button>
      </div>

      <section className="about-section">
        <h2>Why Choose Our Fitness Management System?</h2>
        <p>
          Designed for both beginners and pros, GYFIT simplifies every part of your fitness journey.
        </p>
        <div className='aboutList'>
          <ul className="about-benefits">
            <li>✅ Easy-to-use dashboard with real-time updates</li>
            <li>✅ Access expert trainers and book sessions online</li>
            <li>✅ Comprehensive tracking for progress and nutrition</li>
            <li>✅ Affordable plans with premium support</li>
          </ul>
        </div>

      </section>

      <section className="features-section">
        <h2>Our Key Features</h2>
        <div className="features-container">
          <div className="feature-box">
            <h3>📊 Track Progress</h3>
            <p>Visualize your growth with dynamic graphs, workout logs, and goal milestones</p>
          </div>
          <div className="feature-box">
            <h3>🏋️‍♂️ Personal Training</h3>
            <p>Certified trainers create personalized workout plans tailored to your goals</p>
          </div>
          <div className="feature-box">
            <h3>🍎 Nutrition Management</h3>
            <p>Log your meals and maintain a balanced diet.</p>
          </div>
          <div className="feature-box">
            <h3>💳 Secure Payments</h3>
            <p>Book sessions with easy and secure online payments.</p>
          </div>
          <div className="feature-box">
            <h3>📅 Smart Scheduling</h3>
            <p>Sync your trainer sessions with your calendar easily.</p>
          </div>
          <div className="feature-box">
            <h3>📱 Mobile Friendly</h3>
            <p>Access your dashboard and features from any device on the go.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"This platform changed my fitness routine! Highly recommend it."</p>
            <h4>- Alex M.</h4>
          </div>
          <div className="testimonial">
            <p>"Booking a trainer has never been easier. Love the UI!"</p>
            <h4>- Sarah K.</h4>
          </div>
          <div className="testimonial">
            <p>"I was able to lose 10kg in 3 months with the help of this system!"</p>
            <h4>- Rajiv P.</h4>
          </div>
          <div className="testimonial">
            <p>"Clean, simple and powerful. It keeps me consistent every week."</p>
            <h4>- Meera D.</h4>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Transform Your Life?</h2>
        <p>Join thousands of members who trust GYFIT for their fitness journey.</p>
        <button className="get-started-btn" onClick={() => navigate("/register")}>
          Join Now
        </button>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Fitness Management System. All rights reserved.</p>
          <nav>
            <a href="/">Home</a> |
            <a href="/login">Login</a>
          </nav>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
