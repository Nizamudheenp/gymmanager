import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

function ManageSessions() {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sessionName: "",
    workoutType: "",
    date: "",
    maxParticipants: "",
    workouts: [],
    image: null,
  });
  const [newExercise, setNewExercise] = useState({ exercise: "", sets: "", reps: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAddExercise = () => {
    if (newExercise.exercise && newExercise.sets && newExercise.reps) {
      setFormData({ ...formData, workouts: [...formData.workouts, newExercise] });
      setNewExercise({ exercise: "", sets: "", reps: "" });
    }
  };

  const handleRemoveExercise = (index) => {
    setFormData({ 
      ...formData, 
      workouts: formData.workouts.filter((_, i) => i !== index) 
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "workouts") {
        formDataToSend.append(key, JSON.stringify(formData[key])); 
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });


    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/trainer/createsession`, 
        formDataToSend, 
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      alert("Session created successfully!");
      // navigate("/trainer-dashboard/sessions");
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mt-5">
    <h2 className="text-center">Create Training Session</h2>
    {error && <p className="text-danger">{error}</p>}
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-3">
        <label className="form-label">Session Name</label>
        <input type="text" className="form-control" name="sessionName" value={formData.sessionName} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Workout Type</label>
        <input type="text" className="form-control" name="workoutType" value={formData.workoutType} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Date</label>
        <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Max Participants</label>
        <input type="number" className="form-control" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Workout Exercises</label>
        <div className="d-flex gap-2">
          <input type="text" className="form-control" placeholder="Exercise Name" value={newExercise.exercise} 
            onChange={(e) => setNewExercise({ ...newExercise, exercise: e.target.value })} />
          <input type="number" className="form-control" placeholder="Sets" value={newExercise.sets} 
            onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })} />
          <input type="number" className="form-control" placeholder="Reps" value={newExercise.reps} 
            onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })} />
          <button type="button" className="btn btn-success" onClick={handleAddExercise}>+</button>
        </div>
      </div>

      <ul className="list-group mb-3">
        {formData.workouts.map((workout, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between">
            {workout.exercise} - {workout.sets} Sets x {workout.reps} Reps
            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveExercise(index)}>X</button>
          </li>
        ))}
      </ul>

      <div className="mb-3">
        <label className="form-label">Upload Session Image</label>
        <input type="file" className="form-control" name="image" onChange={handleChange} required />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Creating..." : "Create Session"}
      </button>
    </form>
  </div>
  )
}

export default ManageSessions




