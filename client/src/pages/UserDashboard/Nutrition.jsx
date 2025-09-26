import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";

function NutritionLog() {
  const [foodName, setFoodName] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/nutritionhistory`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const mealsData = response.data?.nutrition?.[0]?.meals || [];
        const sortedMeals = mealsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMeals(sortedMeals.slice(0, 5));
        setError("");
      } catch (error) {
        setError("Something went wrong while fetching meals.");
      }
    };

    fetchMeals();
  }, []);

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
      setMeals((prevMeals) => [newMeal, ...prevMeals].slice(0, 5));
      toast.success("Meal logged");

      setFoodName("");
      setPortionSize("");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to log meal. Please try again.";

      if (message === "You can only log 3 meals per day.") {
        setError("Meal limit reached. You can only log 3 meals per day.");
      } else if (
        message === "No food data found. Please check the meal name."
      ) {
        setError(
          "Invalid food name. Please check your spelling or try another meal."
        );
      } else {
        setError(message);
      }

      setFoodName("");
      setPortionSize("");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    setDeleteLoading(mealId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/deletemeal/${mealId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMeals((prevMeals) => prevMeals.filter((meal) => meal._id !== mealId));
    } catch (error) {
      setError("Failed to delete meal.");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="container mt-4">
      <Card className="p-4 shadow-sm bg-dark text-white">
        <h2 style={{ color: "#ff8c00", textAlign: 'center' }}>Log Your Meals</h2>

        {/* Form */}
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Food Name</Form.Label>
            <Form.Control
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Chicken Breast"
              required
              className="py-3"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Portion Size (g/ml)</Form.Label>
            <Form.Control
              type="number"
              value={portionSize}
              onChange={(e) => setPortionSize(e.target.value)}
              placeholder="e.g., 150"
              required
              className="py-3"
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button
            type="submit"
            style={{ backgroundColor: "#ff8c00" }}
            className="w-100 text-white border-0 py-3"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Log Meal"}
          </Button>
        </Form>

        {/* Display Meals */}
        <h3 className="mt-4" style={{ color: "#ff8c00" }}>Meal History</h3>
        {meals.length > 0 ? (
          <ul className="list-group mt-2">
            {meals.map((meal) => (
              <li
                key={meal._id}
                className="list-group-item d-flex justify-content-between align-items-center bg-secondary text-white flex-column flex-sm-row gap-2 py-3 px-4"
              >
                <div>
                  <strong>{meal.foodName}</strong> — {meal.portionSize}g
                  <br />
                  <small>
                    Calories: {meal.calories} kcal | Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fats: {meal.fats}g
                  </small>
                  <br />
                  <small>Logged at: {new Date(meal.createdAt).toLocaleString()}</small>
                </div>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => handleDeleteMeal(meal._id)}
                  disabled={deleteLoading === meal._id}
                >
                  {deleteLoading === meal._id ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mt-2">No meals logged yet.</p>
        )}
      </Card>
    </div>
  );
}

export default NutritionLog;
