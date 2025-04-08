import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Components.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function WhatBringsYouHere() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (path) => {
    setRedirectPath(path);
    setShow(true);
  };


  return (
    <div className="what-brings-you-here">

      <style>{`
        .custom-modal .modal-content {
          border-radius: 20px;
          box-shadow: 0 0 25px rgba(255, 140, 0, 0.2);
          border: none;
        }
      `}</style>


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

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Body className="text-center py-4">
          <h4 style={{ fontWeight: "700", color: "#ff8c00" }}>Let's complete your registration!</h4>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center pb-4">
          <Button variant="outline-secondary" onClick={handleClose} className="px-4">
            Close
          </Button>
          <Button variant="dark" style={{ backgroundColor: "#ff8c00", border: "none" }} onClick={() => navigate(redirectPath)} className="px-4">
            OK
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default WhatBringsYouHere;
