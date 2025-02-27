const UserDB = require('../models/usermodel')
const TrainerDB = require('../models/trainermodel')
const AdminDB = require('../models/adminmodel')
const JWT = require('jsonwebtoken')
require('dotenv').config()

const userAuth = async (req,res,next) =>{
    try {
        const token = req.header('Authorization')
        if(!token){
            return res.status(401).json({message: "Access denied. No token provided." });
        }
        const decoded = JWT.verify(token,process.env.JWT_CODE)

        const user = await UserDB.findById(decoded.id);

        if (!user){
            return res.status(403).json({  message: "user not found." });
        } 
        
        req.user = user
        
        next()

    } catch (error) {
        res.status(500).json({message:'authentication failed', error: error})
        console.log('server error',error.message);   
    }
}



const trainerAuth = async (req,res,next) =>{
    try {
        const token = req.header('Authorization')
        if(!token){
            return res.status(401).json({message: "Access denied. No token provided." });
        }
        const decoded = JWT.verify(token,process.env.JWT_CODE)

        const trainer = await TrainerDB.findById(decoded.id);

        if (!trainer){
            return res.status(403).json({  message: "trainer not found." });
        } 
        if (!trainer.verified) {
          return res.status(403).json({ message: "Trainer not approved yet. Wait for admin approval." });
        }
        
        req.trainer = trainer
        
        next()

    } catch (error) {
        res.status(500).json({message:'authentication failed', error: error})
        console.log('server error',error.message);   
    }
}

const adminAuth = async (req,res,next) =>{
    try {
        const token = req.header('Authorization')
        if(!token){
            return res.status(401).json({message: "Access denied. No token provided." });
        }
        const decoded = JWT.verify(token,process.env.JWT_CODE)

        const admin = await AdminDB.findById(decoded.id);

        if (!admin){
            return res.status(403).json({  message: "admin not found." });
        } 
        
        req.admin = admin
        
        next()

    } catch (error) {
        res.status(500).json({message:'authentication failed', error: error})
        console.log('server error',error.message);   
    }
}





module.exports = {userAuth, trainerAuth,adminAuth}
