const TrainerDB = require("../models/trainermodel"); 


exports.trainerApproval = async (req,res)=>{
    try {
        const trainer = await TrainerDB.findById(req.params.id)
        if (!trainer){
             return res.status(404).json({ message: "Trainer not found" });
        }
        trainer.verified = true;
        await trainer.save();
        res.json({ success: true, message: "Trainer approved successfully", trainer }); 
    } catch (error) {
        res.status(500).json({ message: "Trainer approval failed", error: error.message });

    }
    
}

