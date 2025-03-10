import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Components.css"; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function WhatBringsYouHere() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [redirectPath, setRedirectPath] = useState(""); // Store which registration to go to

  const handleClose = () => setShow(false);
  const handleShow = (path) => {
    setRedirectPath(path);
    setShow(true);
  };

  return (
    <div className="what-brings-you-here">
      <div className="overlay">
        <h2 className="heading">What Brings You Here?</h2>
        <div className="buttons">
          <button className="btn-option user-btn" onClick={() => handleShow("/register/user")}>
            I need to care for my fitness
          </button>

          <button className="btn-option trainer-btn" onClick={() => handleShow("/register/trainer")}>
            I am a Trainer
          </button>
        </div>
      </div>

      {/* Modal for confirmation */}
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Body style={{ fontSize: "20px", fontWeight: "600" }}>
          Let's complete your registration!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={() => navigate(redirectPath)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default WhatBringsYouHere;
