const FitnessDB = require('../models/fitnessmodel')

exports.setFitnessGoal =  async (req,res)=>{
    try {
       const {goalType,targetProgress,endDate} = req.body
       if(!goalType || !targetProgress || !endDate){
        return res.status(400).json({message:"all fields are required"})
       }
       const newGoal = await FitnessDB.create({
        userId : req.user.id,
        goalType,
        targetProgress,
        endDate
       })
       res.status(201).json({ message: "Fitness goal setting successful", goal: newGoal });

    } catch (error) {
      res.status(500).json({message:"fitness goal setting failed", error:error.message})  
    }
}

exports.updateCurrentProgress = async (req,res)=>{
    try {
        const {currentprogress} = req.body
        const fitnessId  = req.params.id
        
        const Progress = await FitnessDB.findById(fitnessId)
        if(!Progress){
            return res.status(404).json({message:"progress not found"})
        }
        if (Progress.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        Progress.currentprogress = currentprogress;
        if (Progress.currentprogress >= Progress.targetProgress) {
            Progress.status = "Completed";
        }
        await Progress.save()

        res.json({ message: "Progress updated", Progress });
    } catch (error) {
        res.status(500).json({message:"update progress failed", error:error.message})  
 
    }
}

exports.getUserGoals = async (req, res) => {
    try {
        const goals = await FitnessDB.find({ userId: req.user.id });
        res.json({ goals });
    } catch (error) {
        res.status(500).json({ message: "Failed to get fitness goals", error: error.message });
    }
};
