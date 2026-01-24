import axios from 'axios';

export const checkUrl = async (url) => {

  const retries = 3;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, { 
        timeout: 10000, 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
        }
      });
      
      return 'UP';
    } catch (error) {
      if (i === retries - 1) {
        return 'DOWN';
      }
    }
  }
};