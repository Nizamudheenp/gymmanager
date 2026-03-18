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
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-lg border-0 position-relative overflow-hidden"
            style={{ 
              background: "rgba(25, 25, 25, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
            }}
          >
            {/* Top Minimal Accent */}
            <div 
              className="position-absolute top-0 start-0 w-100" 
              style={{ height: "3px", background: "#ff8c00" }}
            />

            <div className="card-body p-4 p-md-5 z-1 position-relative">
              <div className="text-center mb-5">
                <h2 className="text-white fw-bold mb-1">Nutrition Tracker</h2>
                <p className="text-secondary mb-0">Log your meals and track your daily macros</p>
              </div>

              <Form onSubmit={handleSubmit} className="mb-5">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <Form.Group>
                      <Form.Label className="text-secondary small text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>Food Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        placeholder="e.g., Chicken Breast"
                        required
                        className="bg-dark text-white border-secondary border-opacity-25 shadow-none"
                        style={{ padding: "14px 16px", borderRadius: "8px" }}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-12 col-md-6">
                    <Form.Group>
                      <Form.Label className="text-secondary small text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>Portion Size (g/ml)</Form.Label>
                      <Form.Control
                        type="number"
                        value={portionSize}
                        onChange={(e) => setPortionSize(e.target.value)}
                        placeholder="e.g., 150"
                        required
                        className="bg-dark text-white border-secondary border-opacity-25 shadow-none"
                        style={{ padding: "14px 16px", borderRadius: "8px" }}
                      />
                    </Form.Group>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-4 mb-0 border-0 bg-dark text-danger rounded-3" style={{ borderLeft: "4px solid #dc3545" }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-100 fw-bold mt-4 border-0 shadow-sm"
                  disabled={loading}
                  style={{
                    backgroundColor: "#ff8c00",
                    color: "#000",
                    padding: "14px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 140, 0, 0.3)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : <><i className="bi bi-plus-lg me-2"></i>Log Meal</>}
                </Button>
              </Form>

              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
                <h4 className="text-white fw-bold mb-0">Recent Meals</h4>
                <span className="badge rounded-pill fw-bold" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff" }}>
                  {meals.length} Logged
                </span>
              </div>

              {meals.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {meals.map((meal) => (
                    <div
                      key={meal._id}
                      className="p-4 rounded-4 position-relative overflow-hidden"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="text-white fw-bold mb-1">{meal.foodName}</h5>
                          <div className="text-secondary small d-flex align-items-center flex-wrap gap-2 mt-2">
                            <span className="badge bg-dark border border-secondary border-opacity-25 text-light px-2 py-1">
                              <i className="bi bi-pie-chart text-secondary me-1"></i> {meal.portionSize}g
                            </span>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger border-0 d-flex align-items-center justify-content-center"
                          onClick={() => handleDeleteMeal(meal._id)}
                          disabled={deleteLoading === meal._id}
                          title="Delete meal"
                          style={{ width: "32px", height: "32px", borderRadius: "8px" }}
                        >
                          {deleteLoading === meal._id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <i className="bi bi-trash3"></i>
                          )}
                        </button>
                      </div>

                      <div className="row g-2 mt-3">
                        {[
                          { label: 'Calories', value: `${meal.calories} kcal` },
                          { label: 'Protein', value: `${meal.protein}g` },
                          { label: 'Carbs', value: `${meal.carbs}g` },
                          { label: 'Fats', value: `${meal.fats}g` }
                        ].map((macro, idx) => (
                          <div key={idx} className="col-6 col-sm-3">
                            <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-10 text-center h-100">
                              <div className="text-white fw-bold mb-1" style={{ fontSize: "1.1rem" }}>{macro.value}</div>
                              <div className="text-secondary text-uppercase fw-bold" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>{macro.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-5 rounded-4" style={{ background: "rgba(25, 25, 25, 0.4)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <i className="bi bi-cup-hot opacity-50" style={{ fontSize: "3rem", color: "#ffffff" }}></i>
                  <p className="text-secondary mt-3 mb-0 fs-5">No meals logged today.</p>
                  <p className="text-secondary small mt-1">Add your food above to track your macros.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionLog;
