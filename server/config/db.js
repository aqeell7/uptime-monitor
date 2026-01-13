import mongoose from "mongoose";

export const connectDb = async ()=>{

  try{
   const conn =  mongoose.connect(process.env.MONGO_URI)
   console.log('mongo connected');
   
  }catch(error){
    console.error(error)
    process.exit(1)
  }
}