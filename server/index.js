const express = require('express')
const app = express()
require('dotenv').config()
const authRoute = require('./src/routes/authRoute')
const adminRoute = require('./src/routes/adminRoute')
const userRoute = require('./src/routes/userRoute')
const trainerRoute = require('./src/routes/trainerRoute')
const connectDB = require('./src/config/db')
connectDB()

app.use(express.json());

app.use('/api/auth',authRoute)
app.use('/api/user', userRoute)
app.use('/api/trainer', trainerRoute)
app.use('/api/admin', adminRoute)

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`app listening at port : ${port}`);
    
})