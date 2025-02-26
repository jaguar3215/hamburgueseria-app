// src/utils/logger.js
const logger = {
    debug: (message, data) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] ${message}`, data || '');
      }
    },
    
    error: (message, error) => {
      console.error(`[ERROR] ${message}`, error);
    },
    
    info: (message, data) => {
      console.log(`[INFO] ${message}`, data || '');
    }
  };
  
  export default logger;