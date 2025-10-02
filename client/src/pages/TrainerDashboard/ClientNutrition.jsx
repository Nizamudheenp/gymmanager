import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ListGroup, Button } from "react-bootstrap"

function ClientNutrition() {
  const [nutritions, setNutritions] = useState([])

  const token = localStorage.getItem("token")
  const { userId } = useParams()

  useEffect(() => {
    const fetchUserNutritions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/trainer/usernutrition/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setNutritions(response.data.nutrition?.meals || [])
      } catch (error) {
        console.error(error)
        setNutritions([])
      }
    }
    fetchUserNutritions()
  }, [userId, token])

  return (
    <div className="container mt-4">
      <div
        className="card shadow-md border-0"
        style={{ backgroundColor: "#1c1c1c", color: "#f8f9fa", padding: "10px" }}
      >
        <div className="card-body">
          {nutritions.length === 0 ? (
            <p className="text-secondary">No meals logged yet.</p>
          ) : (
            <ListGroup>
              {nutritions.map((nutrition, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center bg-dark text-light p-3 mb-3 rounded"
                >
                  <div>
                    <strong>{nutrition.foodName}</strong> – {nutrition.portionSize}g  
                    <br />
                    <small className="text-secondary">
                      {nutrition.calories} kcal | {nutrition.protein}g Protein | {nutrition.carbs}g Carbs | {nutrition.fats}g Fats
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientNutrition
