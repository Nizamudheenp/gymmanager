const UserDB = require('../models/usermodel')
const TrainerDB = require("../models/trainermodel"); 
const AdminDB = require('../models/adminmodel')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
require('dotenv').config()
const uploadCloudinary = require('../utilities/uploadCloudinary');


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
        const { username, email, password, specialization, experience } = req.body;

        const trainerExists = await TrainerDB.findOne({ email });
        if (trainerExists) {
            return res.status(409).json({ message: "Trainer already exists" });
        } 

        const hashedPassword = await bcrypt.hash(password, 10);

        let certificationUrl = null;
        if (req.file) { 
            certificationUrl = await uploadCloudinary(req.file.path, "certifications"); 
        }


        const newTrainer = await TrainerDB.create({
            username,
            email,
            password: hashedPassword,
            specialization,
            experience,
            certifications:certificationUrl,
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

       const adminExists = await AdminDB.findOne({email})
       if(adminExists){
        return res.status(409).json({message:'admin already exists'})
       }

       const hashedPassword =  await bcrypt.hash(password,10)
       
       const newAdmin =await AdminDB.create({
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

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      let user = await UserDB.findOne({ email });
      let role = "user"; 
      let verified = true;
  
      if (!user) {
        user = await TrainerDB.findOne({ email });
        verified = user?.verified || false;
        role = "trainer";
      }
  
      if (!user) {
        user = await AdminDB.findOne({ email });
        role = "admin";
        verified = true;
      }
  
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const token = JWT.sign(
        { id: user._id, role },
        process.env.JWT_CODE,
        { expiresIn: "3d" }
      );
  
      res.json({ message: "Login successful", token, role,verified });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  };


module.exports = {userRegister,trainerRegister,adminRegister,login};
