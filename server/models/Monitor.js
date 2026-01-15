import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema({
  ownership:{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true
  },
  name:{
    type:String,
    required:true,
    trim: true
  },

  url:{
    type:String,
    required:true,
    trim: true
  },

  status:{
    type:String,
    enum:[' UP','DOWN'],
    default:'UP'
  },
  lastCheckedAt:{
    type: Date,
  },
  
},
{
  timestamps:true
} 
)

export default mongoose.model('Monitor', monitorSchema)