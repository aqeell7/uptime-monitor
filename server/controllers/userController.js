import User from "../models/User.js"

export const registerUser = async (req,res)=>{
  const {name,email,password} = req.body

  try{
     const user = await User.findOne({ email })

     if(user){
      return res.status(400).json({ message: 'user already exists'})
     }

     const newUser = await User.create({
      name,
      email,
      password,
     })

     if(newUser){
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      })
     }else{
      return res.status(400).json({
        message: 'invalid user data'
      })
     }
     
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'server error'})
  }
}
