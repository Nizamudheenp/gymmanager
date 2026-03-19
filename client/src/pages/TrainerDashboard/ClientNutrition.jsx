import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ListGroup, Button, Container, Badge, Card } from "react-bootstrap"

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
    <Container className="px-0 pt-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold mb-0">Client Nutrition Log</h3>
        <Badge bg="warning" text="dark" className="px-3 py-2">
          {nutritions.length} Meal{nutritions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {!nutritions.length ? (
        <div className="glass-card p-5 text-center">
            <p className="text-white-50 mb-0 italic">No meals logged by the client yet.</p>
        </div>
      ) : (
        <div className="row">
          {nutritions.map((nutrition, index) => (
            <div key={index} className="col-12 mb-3">
              <Card className="glass-card border-0 shadow-sm overflow-hidden">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-warning-subtle p-3 rounded-circle text-warning">
                        <i className="fas fa-utensils h5 mb-0"></i>
                      </div>
                      <div>
                        <h5 className="text-white fw-bold mb-1">{nutrition.foodName}</h5>
                        <p className="text-warning mb-0 fw-bold">{nutrition.portionSize}g Portion</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-dark-50 rounded-3 p-3">
                    <div className="row text-center g-2">
                      <div className="col-3 border-end border-white-10">
                        <small className="text-white-50 d-block">Calories</small>
                        <span className="text-white fw-bold">{nutrition.calories}</span>
                      </div>
                      <div className="col-3 border-end border-white-10">
                        <small className="text-white-50 d-block">Protein</small>
                        <span className="text-white fw-bold">{nutrition.protein}g</span>
                      </div>
                      <div className="col-3 border-end border-white-10">
                        <small className="text-white-50 d-block">Carbs</small>
                        <span className="text-white fw-bold">{nutrition.carbs}g</span>
                      </div>
                      <div className="col-3">
                        <small className="text-white-50 d-block">Fats</small>
                        <span className="text-white fw-bold">{nutrition.fats}g</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export default ClientNutrition
