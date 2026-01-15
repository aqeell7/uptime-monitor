import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true
  },
  name:{
    type: String,
    required: true,
    trim: true
  },
  url:{
    type: String,
    required: true,
    trim: true
  },
  status:{
    type: String,
    enum: ['UP','DOWN'],
    default: 'UP'
  },
  lastCheckedAt:{
    type: Date,
    default:null
  }
},
{
  timestamps:true
})

export default mongoose.model('Monitor', monitorSchema)