const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    meals: [
        {
            foodName: { type: String, required: true }, 
            portionSize: { type: String, required: true }, 
            calories: { type: Number, required: true }, 
            protein: { type: Number, required: true },  
            carbs: { type: Number, required: true },  
            fats: { type: Number, required: true },
            date: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("nutritions", nutritionSchema);
