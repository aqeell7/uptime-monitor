import express from 'express'
const app = express()
const PORT = 5000;
import { connectDb } from './config/db.js';
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import monitorRoutes from './routes/monitorRoutes.js'
import startMonitor from './jobs/uptimeJobs.js';
import cors from 'cors';


app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true
}))

dotenv.config()
app.use(express.json())

app.get('/',(req,res)=>{
  res.json('simple express app is working')
})

app.use('/api/users', userRoutes)
app.use('/api/monitors', monitorRoutes)

connectDb()
startMonitor();

app.listen(PORT,()=>{
  console.log(`server is running at ${PORT}`)
})