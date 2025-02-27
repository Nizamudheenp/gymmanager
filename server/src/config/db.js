const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async()=>{
    try {
     const db = await mongoose.connect(process.env.MONGOURI)
     if(db){
        console.log("DB conection successful");
        
     }

    } catch (error) {
       console.log("db connection failed");
        
    }
}

module.exports = connectDB