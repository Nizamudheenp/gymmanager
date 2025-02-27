const UserDB = require('../models/usermodel')
const TrainerDB = require("../models/trainermodel"); 
const adminDB = require('../models/adminmodel')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
require('dotenv').config()


const userRegister = async (req,res)=>{
    try {
       const {username, password,email,fitnessData} = req.body

       const userExistes = await UserDB.findOne({email})
       if(userExistes){
        return res.status(409).json({message:'user already exists'})
       }

       const hashedPassword =  await bcrypt.hash(password,10)
       
       const newUser =await UserDB.create({
        username,
        password:hashedPassword,
        email,
        fitnessData})

       if(newUser){
        res.status(201).json({message:'user registration successful',data:newUser})
       }

    } catch (error) {
      res.status(500).json({message:'registraition failed', error: error})
      console.log('server error',error.message);
        
    }
}



const trainerRegister = async (req, res) => {
    try {
        const { username, email, password, specialization, experience, certifications } = req.body;

        const trainerExists = await TrainerDB.findOne({ email });
        if (trainerExists) {
            return res.status(409).json({ message: "Trainer already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newTrainer = await TrainerDB.create({
            username,
            email,
            password: hashedPassword,
            specialization,
            experience,
            certifications,
            verified: false 
        });

        res.status(201).json({
            message: "Trainer registered successfully, pending admin approval.",
            data: newTrainer
        });

    } catch (error) {
        console.error("Trainer Registration Error:", error.message);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

const adminRegister = async (req,res)=>{
    try {
       const {username, password,email} = req.body

       const adminExists = await adminDB.findOne({email})
       if(adminExists){
        return res.status(409).json({message:'admin already exists'})
       }

       const hashedPassword =  await bcrypt.hash(password,10)
       
       const newAdmin =await adminDB.create({
        username,
        password:hashedPassword,
        email,})

       if(newAdmin){
        res.status(201).json({message:'admin registration successful',data:newAdmin})
       }

    } catch (error) {
      res.status(500).json({message:'registraition failed', error: error})
      console.log('server error',error.message);
        
    }
}

const userLogin = async (req,res)=>{
    try {
        const {email, password} = req.body
 
        const user = await UserDB.findOne({email})
        if(!user){
         return res.status(409).json({message:'user not found'})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = JWT.sign({id:user._id,role:"user"},process.env.JWT_CODE,{expiresIn:'1d'})

        res.json({  message: "User login successful",
                    token, user: { id: user._id, name: user.username, role: "user" } });

 
     } catch (error) {
       res.status(500).json({message:'login failed', error: error})
       console.log('server error',error.message);
     } 
}

const trainerLogin = async (req,res)=>{
    try {
        const {email, password} = req.body
 
        const trainer = await TrainerDB.findOne({email})
        if(!trainer){
         return res.status(409).json({message:'user not found'})
        }

        const isMatch = await bcrypt.compare(password, trainer.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = JWT.sign({id:trainer._id,role:"trainer"},process.env.JWT_CODE,{expiresIn:'1d'})

        res.json({  message: "trainer login successful",
                    token, trainer: { id: trainer._id, name: trainer.username, role: "trainer" } });

 
     } catch (error) {
       res.status(500).json({message:'login failed', error: error})
       console.log('server error',error.message);
     } 
}

const adminLogin = async (req,res)=>{
    try {
        const {email, password} = req.body
 
        const admin = await adminDB.findOne({email})
        if(!admin){
         return res.status(409).json({message:'user not found'})
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = JWT.sign({id:admin._id,role:"admin"},process.env.JWT_CODE,{expiresIn:'1d'})

        res.json({  message: "admin login successful",
                    token, admin: { id: admin._id, name: admin.username, role: "admin" } });

 
     } catch (error) {
       res.status(500).json({message:'login failed', error: error})
       console.log('server error',error.message);
     } 
}


module.exports = {userRegister,trainerRegister,adminRegister, userLogin,trainerLogin,adminLogin};
