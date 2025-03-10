import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import "./Components.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* 🔹 Navbar (Fixed at the Top) */}
      <nav className="navbar-custom" id='homepage-navbar'>
        <Nav>
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav.Item>
        </Nav>
      </nav>

      {/* 🔹 Main Background Section */}
      <div className="homapge-mainview">
        <h1>Welcome to Fitness Management System</h1>
        <p>Track your fitness, book trainers, and manage your progress.</p>

        <button className="get-started-btn mt-4"  onClick={() => navigate("/what-brings-you-here")}>
          Get Started
        </button>
      </div>
    </>
  );
}

export default HomePage;
