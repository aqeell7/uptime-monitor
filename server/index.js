import express from 'express'
const app = express()
const PORT = 5000;
import { connectDb } from './config/db.js';
import dotenv from 'dotenv'

dotenv.config()

app.get('/',(req,res)=>{
  res.json('simple express app is working')
})

connectDb()

app.listen(PORT,()=>{
  console.log(`server is running at ${PORT}`)
})