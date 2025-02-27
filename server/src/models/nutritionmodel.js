const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    meals: [
        {
            mealType: String,
            calories: Number,
            protein: Number,
            carbs: Number,
            fats: Number
        }
    ],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("nutritions", nutritionSchema);
