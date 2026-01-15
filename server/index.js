import express from 'express'
const app = express()
const PORT = 5000;
import { connectDb } from './config/db.js';
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import monitorRoutes from './routes/monitorRoutes.js'

dotenv.config()
app.use(express.json())

app.get('/',(req,res)=>{
  res.json('simple express app is working')
})

app.use('/api/users', userRoutes)
app.use('/api/monitors', monitorRoutes)

connectDb()

app.listen(PORT,()=>{
  console.log(`server is running at ${PORT}`)
})