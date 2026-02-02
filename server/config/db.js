import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    
    console.log("MongoDB not ready yet. Retrying in 5 seconds...");
    setTimeout(connectDb, 5000);
  }
};