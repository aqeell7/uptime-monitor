import express from 'express'
import { connectDb } from './config/db.js';
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import monitorRoutes from './routes/monitorRoutes.js'
import startMonitor from './jobs/uptimeJobs.js';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http'

dotenv.config()
connectDb()

const app = express()
const server = http.createServer(app)

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost"],
  credentials: true
}));

app.use(express.json())

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

export let ioInstance = null;

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id)

  socket.on('join_room', (userId) => {
    socket.join(userId)
    console.log(`Socket ${socket.id} joined room ${userId}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

ioInstance = io;

app.use('/api/users', userRoutes)
app.use('/api/monitors', monitorRoutes)

startMonitor();

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`server is running at ${PORT}`)
})
