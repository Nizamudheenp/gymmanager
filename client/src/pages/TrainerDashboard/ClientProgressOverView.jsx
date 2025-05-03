import React, { useEffect, useState } from "react";
import axios from "axios";

function ClientProgressOverview() {
  const [clients, setClients] = useState([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const [averageSets, setAverageSets] = useState(0);
  const [averageReps, setAverageReps] = useState(0);
  const [averageCalories, setAverageCalories] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/trainer/getbookings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const confirmedClients = response.data.appointments.filter(
          (client) => client.status === "confirmed"
        );
        setClients(confirmedClients);

        let totalWorkoutsCount = 0;
        let totalSets = 0;
        let totalReps = 0;
        let totalMealsCount = 0;
        let totalCalories = 0;

        for (const client of confirmedClients) {
          try {
            const workoutRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/trainer/getuserworkouts/${client.userId._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const workouts = workoutRes.data.workouts || [];
            totalWorkoutsCount += workouts.length;
            workouts.forEach((workout) => {
              totalSets += workout.sets;
              totalReps += workout.reps;
            });
          } catch (err) {
            console.warn(`No workouts found for ${client.userId._id}`);
          }


          try {
            const nutritionRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/trainer/usernutrition/${client.userId._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const meals = nutritionRes.data.nutrition?.meals || [];
            totalMealsCount += meals.length;
            meals.forEach((meal) => {
              totalCalories += meal.calories;
            });
          } catch (err) {
            console.warn(`No meals found for ${client.userId._id}`);
          }
        }

        setTotalWorkouts(totalWorkoutsCount);
        setTotalMeals(totalMealsCount);
        setAverageSets(totalWorkoutsCount ? (totalSets / totalWorkoutsCount).toFixed(1) : 0);
        setAverageReps(totalWorkoutsCount ? (totalReps / totalWorkoutsCount).toFixed(1) : 0);
        setAverageCalories(totalMealsCount ? (totalCalories / totalMealsCount).toFixed(1) : 0);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchClientData();
  }, [token]);

  return (
    <div className="container mt-4">
      <div className="card p-3 shadow-sm"
        style={{
          backgroundColor: "transparent",
          color: "white",
          fontSize: "17px",
          border: "1px solid orange"
        }}>
        <p><strong>Total Clients:</strong> {clients.length}</p>
        <p><strong>Total Workouts Assigned:</strong> {totalWorkouts}</p>
        <p><strong>Avg. Sets per Workout:</strong> {averageSets}</p>
        <p><strong>Avg. Reps per Workout:</strong> {averageReps}</p>
        <p><strong>Total Meals Logged:</strong> {totalMeals}</p>
        <p><strong>Avg. Calories per Meal:</strong> {averageCalories} kcal</p>
      </div>
    </div>

  );
}

export default ClientProgressOverview;
