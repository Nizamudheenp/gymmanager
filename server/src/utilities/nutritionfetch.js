const axios = require("axios");
require("dotenv").config();

const USDA_API_KEY = process.env.USDA_API_KEY;

async function getNutrition(foodName, portionSize) {
    try {
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&api_key=${USDA_API_KEY}`;
        const response = await axios.get(url);

        if (!response.data.foods || response.data.foods.length === 0) {    
            console.log(` No food data found for: ${foodName}`);
            return null;  
        }

        const foodData = response.data.foods[0];  
        const servingSizeFromAPI = foodData.servingSize || 100;  


        const portion = parseFloat(portionSize);
        if (isNaN(portion) || portion <= 0) {
            console.log(`Invalid portion size: ${portionSize}`);
            return null;
        }

        const caloriesPerServing = foodData.foodNutrients.find(n => n.nutrientName.includes("Energy"))?.value || 0;
        const proteinPerServing = foodData.foodNutrients.find(n => n.nutrientName.includes("Protein"))?.value || 0;
        const carbsPerServing = foodData.foodNutrients.find(n => n.nutrientName.includes("Carbohydrate"))?.value || 0;
        const fatsPerServing = foodData.foodNutrients.find(n => n.nutrientName.includes("Total lipid"))?.value || 0;


        const portionRatio = portion / servingSizeFromAPI;

        return {
            calories: Math.round(caloriesPerServing * portionRatio),
            protein: Math.round(proteinPerServing * portionRatio),
            carbs: Math.round(carbsPerServing * portionRatio),
            fats: Math.round(fatsPerServing * portionRatio)
        };

    } catch (error) {
        console.error(" Error fetching nutrition data:", error.message);
        return null;
    }
}

module.exports = getNutrition
