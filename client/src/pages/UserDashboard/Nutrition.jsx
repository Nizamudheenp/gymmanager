import React, { useState, useEffect } from "react";
import axios from "axios";

function NutritionLog() {
  const [foodName, setFoodName] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/nutritionhistory`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.nutrition.length > 0) {
          setMeals(response.data.nutrition[0].meals);
        } else {
          setMeals([]);
        }
      } catch (error) {
        setError("Failed to fetch meals.");
      }
    };

    fetchMeals();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/logmeal`,
        { foodName, portionSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMeal = response.data.nutrition.meals.slice(-1)[0];
      setMeals((prevMeals) => [...prevMeals, newMeal]);

      setFoodName("");
      setPortionSize("");
    } catch (error) {
      setError("Failed to log meal.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
  <h2 className="text-center text-dark">Log  Meals</h2>

  {error && <div className="alert alert-danger">{error}</div>}

  {/* Meal Logging Form */}
  <form onSubmit={handleSubmit} className="card p-3 shadow-sm bg-dark text-light">
    <div className="mb-3">
      <label className="form-label text-warning">Food Name</label>
      <input
        type="text"
        className="form-control bg-secondary text-light border-0"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        required
      />
    </div>
    <div className="mb-3">
      <label className="form-label text-warning">Portion Size (g/ml)</label>
      <input
        type="number"
        className="form-control bg-secondary text-light border-0"
        value={portionSize}
        onChange={(e) => setPortionSize(e.target.value)}
        required
      />
    </div>
    <button type="submit" className="btn btn-warning w-100" disabled={loading}>
      {loading ? "Logging Meal..." : "Log Meal"}
    </button>
  </form>

  {/* Display Logged Meals */}
  <h3 className="mt-4 text-dark">Nutrition Details</h3>
  
  {meals.length === 0 ? (
    <p className="text-secondary">No meals logged yet.</p>
  ) : (
    <table className="table table-bordered mt-3">
      <thead className="table-dark">
        <tr className="text-warning">
          <th>Food</th>
          <th>Portion Size</th>
          <th>Calories</th>
          <th>Protein</th>
          <th>Carbs</th>
          <th>Fats</th>
        </tr>
      </thead>
      <tbody className="bg-dark text-light">
        {meals.map((meal, index) => (
          <tr key={index}>
            <td>{meal.foodName}</td>
            <td>{meal.portionSize}g</td>
            <td>{meal.calories}</td>
            <td>{meal.protein}g</td>
            <td>{meal.carbs}g</td>
            <td>{meal.fats}g</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

  );
}

export default NutritionLog;
