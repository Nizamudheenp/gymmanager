const mongoose = require('mongoose')

const fitnessSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref:"users",required:true},
    goalType :{type:String,enum:["weight loss", "weight gain","muscle gain",]},
    targetProgress:{type:Number,required:true},
    currentprogress:{type:Number,default:0},
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ["In Progress", "Completed"], default: "In Progress" }

})

module.exports = mongoose.model('fitness',fitnessSchema)