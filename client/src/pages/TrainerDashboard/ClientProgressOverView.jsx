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
    <div className="w-100" style={{ textAlign: "left" }}>
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
          width: "100%"
        }}
      >
        <div style={{ padding: "20px", borderLeft: "4px solid #ff8c00", background: "rgba(255, 140, 0, 0.05)", borderRadius: "0 12px 12px 0" }}>
          <div style={{ fontSize: "0.85rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total Active Clients</div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#fff" }}>{clients.length}</div>
        </div>
        
        <div style={{ padding: "20px", borderLeft: "4px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.02)", borderRadius: "0 12px 12px 0" }}>
          <div style={{ fontSize: "0.85rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Workouts Assigned</div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#fff" }}>{totalWorkouts}</div>
        </div>

        <div style={{ padding: "20px", borderLeft: "4px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.02)", borderRadius: "0 12px 12px 0" }}>
          <div style={{ fontSize: "0.85rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Training Volume (Reps)</div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#fff" }}>{averageReps} <span style={{ fontSize: "0.9rem", fontWeight: "400", opacity: 0.4 }}>avg</span></div>
        </div>

        <div style={{ padding: "20px", borderLeft: "4px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.02)", borderRadius: "0 12px 12px 0" }}>
          <div style={{ fontSize: "0.85rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Dietary Adherence</div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#fff" }}>{totalMeals} <span style={{ fontSize: "0.9rem", fontWeight: "400", opacity: 0.4 }}>logs</span></div>
        </div>
      </div>
    </div>
  );
}

export default ClientProgressOverview;
