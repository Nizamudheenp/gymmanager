import React from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';

function HomePage() {
  const navigate =  useNavigate()
  return (
    <>
    <Nav fill variant="tabs" defaultActiveKey="/login">
    <Nav.Item>
      <Nav.Link href="/login">login</Nav.Link>
    </Nav.Item>
    
  </Nav>
    <div className="container text-center mt-5">
      <h1>Welcome to Fitness Management System</h1>
      <p>Track your fitness, book trainers, and manage your progress.</p>

      <button className="btn btn-primary mt-4" onClick={() => navigate("/what-brings-you-here")}>
        Get Started
      </button>
    </div>
    </>
  )
}

export default HomePage