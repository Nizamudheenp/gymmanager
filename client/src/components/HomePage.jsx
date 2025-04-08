import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import "./Components.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar-custom" id='homepage-navbar'>
        <div className='nav-logo'>
          <img src="src/assets/gyfit logo.jpg" alt="" />
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
          Our platform helps you stay on track with your fitness journey. From tracking workouts to booking
          trainers, everything is simplified in one place.
        </p>
      </section>

      <section className="features-section">
        <h2>Our Key Features</h2>
        <div className="features-container">
          <div className="feature-box">
            <h3>📊 Track Progress</h3>
            <p>Monitor your fitness journey with detailed analytics.</p>
          </div>
          <div className="feature-box">
            <h3>🏋️‍♂️ Personal Training</h3>
            <p>Book trainers and receive customized workout plans.</p>
          </div>
          <div className="feature-box">
            <h3>🍎 Nutrition Management</h3>
            <p>Log your meals and maintain a balanced diet.</p>
          </div>
          <div className="feature-box">
            <h3>💳 Secure Payments</h3>
            <p>Book sessions with easy and secure online payments.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"This platform changed my fitness routine! Highly recommend it."</p>
          <h4>- Alex M.</h4>
        </div>
        <div className="testimonial">
          <p>"Booking a trainer has never been easier. Love the UI!"</p>
          <h4>- Sarah K.</h4>
        </div>
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
