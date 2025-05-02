import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Row, Col, Form, Button, Table, Alert } from "react-bootstrap";

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

        const mealsData = response.data?.nutrition?.[0]?.meals || [];

        setMeals(mealsData)
        setError("")

      } catch (error) {
        setError("Something went wrong while fetching meals.");
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
      setMeals((prevMeals) => [newMeal, ...prevMeals]);
      toast.success("Meal added successfully");

      setFoodName("");
      setPortionSize("");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to log meal. Please try again.";

        if (message === "You can only log 3 meals per day.") {
          setError("Meal limit reached. You can only log 3 meals per day.");

        } else if (message === "No food data found. Please check the meal name.") {
        setError("Invalid food name. Please check your spelling or try another meal.");

      } else {
        setError(message);
      }
      setFoodName("");
    setPortionSize("");
    }
    setLoading(false);
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/deletemeal/${mealId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMeals((prevMeals) => prevMeals.filter((meal) => meal._id !== mealId));
    } catch (error) {
      setError("Failed to delete meal.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-dark">Log Meals</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Meal Logging Form */}
      <Form onSubmit={handleSubmit} className="card p-3 shadow-sm bg-dark text-light">
        <Row>
          <Col xs={12} sm={6}>
            <Form.Group controlId="foodName">
              <Form.Label className="text-warning">Food Name</Form.Label>
              <Form.Control
                type="text"
                className="bg-secondary text-light border-0"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Group controlId="portionSize">
              <Form.Label className="text-warning">Portion Size (g/ml)</Form.Label>
              <Form.Control
                type="number"
                className="bg-secondary text-light border-0"
                value={portionSize}
                onChange={(e) => setPortionSize(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" className="btn btn-warning w-100 mt-3" disabled={loading}>
          {loading ? "Logging Meal..." : "Log Meal"}
        </Button>
      </Form>

      {/* Display Logged Meals */}
      <h3 className="mt-4 text-dark">Nutrition Details</h3>

      {meals.length === 0 ? (
        <p className="text-secondary">No meals logged yet.</p>
      ) : (
        <Table striped bordered hover responsive className="mt-3 bg-dark text-light">
          <thead className="table-dark">
            <tr className="text-warning">
              <th>Food</th>
              <th>Portion Size</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fats</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, index) => (
              <tr key={index}>
                <td>{meal.foodName}</td>
                <td>{meal.portionSize}g</td>
                <td>{meal.calories}</td>
                <td>{meal.protein}g</td>
                <td>{meal.carbs}g</td>
                <td>{meal.fats}g</td>
                <td>{new Date(meal.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteMeal(meal._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default NutritionLog;
