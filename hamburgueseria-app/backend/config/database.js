// config/database.js
const mongoose = require('mongoose');

/**
 * Configuración y conexión a la base de datos MongoDB
 */
async function connectToDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hamburgueseria';
    
    // Configuraciones de Mongoose
    mongoose.set('strictQuery', true);
    
    const options = {
      autoIndex: true,
    };
    
    // Conectar a MongoDB
    await mongoose.connect(mongoURI, options);
    
    console.log('Conexión a MongoDB establecida exitosamente');
    
    // Manejadores de eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('Error en la conexión a MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('Desconectado de MongoDB');
    });
    
    // Manejar cierre de aplicación
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexión a MongoDB cerrada debido a la terminación de la aplicación');
      process.exit(0);
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };