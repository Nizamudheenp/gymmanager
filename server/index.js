const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const authRoute = require('./src/routes/authRoute')
const adminRoute = require('./src/routes/adminRoute')
const userRoute = require('./src/routes/userRoute')
const trainerRoute = require('./src/routes/trainerRoute')
const messageRoute = require('./src/routes/messageRoute')
const paymentRoutes = require('./src/routes/paymentsRoute')

const connectDB = require('./src/config/db')
connectDB()

app.use(express.json())

app.use(cors({
    origin: [process.env.FRONTEND_URL,
        "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}))

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/trainer', trainerRoute)
app.use('/api/admin', adminRoute)
app.use('/api/messages', messageRoute)


app.use('/api/payments', paymentRoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin:[process.env.FRONTEND_URL ,
            "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
})

let activeUsers = {}

io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`)

    socket.on("join", ({ userId }) => {
        if (userId && !activeUsers[userId]) {
            activeUsers[userId] = socket.id
            console.log(`${userId} is online`)
        }
    })

    socket.on("send_message", async ({ senderId, receiverId, message }) => {
        const receiverSocketId = activeUsers[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive_message", { senderId, message })
        }
    })

    socket.on("disconnect", () => {
        const disconnectedUser = Object.keys(activeUsers).find(userId => activeUsers[userId] === socket.id)
        if (disconnectedUser) {
            console.log(`${disconnectedUser} disconnected`)
            delete activeUsers[disconnectedUser]
        }
    })
})

const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})
