import Monitor from "../models/Monitor.js"

export const createMonitor = async (req,res)=>{
  const {url,name} = req.body

  if(!url || !name){
    return res.status(400).json({message:'please provide all the fields'})
  }

  try{
    const newMonitor = await Monitor.create({
      user:req.user._id,
      name:name.trim(),
      url:url.trim()
    })

    return res.status(201).json({message:"new monitor has been created", newMonitor})
  }catch(error){
    console.log(error);
    return res.status(500).json({message: 'server error'})
  }
} 