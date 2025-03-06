import React from 'react'
import { useNavigate } from "react-router-dom";


function WhatBringsYouHere() {
    const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
    <h2>What Brings You Here?</h2>

    <div className="d-flex justify-content-center gap-4 mt-4">
        <button className="btn btn-success" onClick={() => navigate("/register/user")}>
          I need to care my fitness
        </button>
        <button className="btn btn-warning" onClick={() => navigate("/register/trainer")}>
          I am a Trainer
        </button>
      </div>
  </div>
  )
}

export default WhatBringsYouHere