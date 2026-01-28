import axios from 'axios';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const checkUrl = async (url) => {

  const retries = 3;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, { 
        timeout: 5000, 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive'
        }
      });
      
      if (response.status >= 200 && response.status < 300) {
        return 'UP';
      } else {
        throw new Error(`Status ${response.status}`);
      }

    } catch (error) {
      if (i === retries - 1) {
        return 'DOWN';
      }
      
      await sleep(1000); 
    }
  }
};