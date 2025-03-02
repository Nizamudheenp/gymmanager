const express = require('express')
const app = express()
require('dotenv').config()
const http = require('http')
const {Server}= require('socket.io')
const cors = require('cors')

const authRoute = require('./src/routes/authRoute')
const adminRoute = require('./src/routes/adminRoute')
const userRoute = require('./src/routes/userRoute')
const trainerRoute = require('./src/routes/trainerRoute')
const messageRoute = require('./src/routes/messageRoute')

const connectDB = require('./src/config/db')
connectDB()

app.use(express.json());

app.use('/api/auth',authRoute)
app.use('/api/user', userRoute)
app.use('/api/trainer', trainerRoute)
app.use('/api/admin', adminRoute)
app.use("/api/messages",messageRoute);

const server = http.createServer(app)
const io = new Server(server,{
    cors : {origin:"*"}
})

let activeUsers = {};

io.on("connection", (socket) => {
console.log(` New connection: ${socket.id}`);

socket.on("join", ({ userId }) => {
    activeUsers[userId] = socket.id; 
    console.log(` ${userId} is online`);
});

socket.on("send_message", ({ senderId, receiverId, message }) => {
    const receiverSocketId = activeUsers[receiverId]; 
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", { senderId, message });
    }
});

socket.on("disconnect", () => {
    Object.keys(activeUsers).forEach((userId) => {
        if (activeUsers[userId] === socket.id) {
            console.log(` ${userId} disconnected`);
            delete activeUsers[userId];
        }
    });
});
});

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`app listening at port : ${port}`);
    
})