import axios from "axios"
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

function ClientNutrition() {
  const [nutritions, setNutritions] = useState([])


  const token = localStorage.getItem("token")
  const { userId } = useParams()

  useEffect(() => {
    const fetchUserNutritions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trainer/usernutrition/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setNutritions(response.data.nutrition?.meals || []);
      } catch (error) {
        console.error(error);
        setNutritions([]);
      }

    }
    fetchUserNutritions()
  }, [userId, token])
  return (
    <div>
      <h3 className="mt-4">Nutrition Details</h3>
      {nutritions.length === 0 ? (
        <p className="text-muted">No meals user logged yet.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Food</th>
              <th>Portion Size</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fats</th>
            </tr>
          </thead>
          <tbody>
            {nutritions.map((nutrition, index) => (
              <tr key={index}>
                <td>{nutrition.foodName}</td>
                <td>{nutrition.portionSize}g</td>
                <td>{nutrition.calories}</td>
                <td>{nutrition.protein}g</td>
                <td>{nutrition.carbs}g</td>
                <td>{nutrition.fats}g</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ClientNutrition