import axios from 'axios'

export const checkUrl = async (url)=>{

  try{
    const response = await axios.get(url, {timeout: 5000})

    return 'UP';    
  }catch(error){
    return 'DOWN'
  }
}