// scripts/setup-admin.js
const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hamburgueseria')
  .then(async () => {
    // Importar modelos
    const Sucursal = require('../models/Sucursal');
    const Usuario = require('../models/Usuario');
    
    try {
      // Crear primera sucursal si no existe
      let sucursal = await Sucursal.findOne({ nombre: 'Sucursal Principal' });
      
      if (!sucursal) {
        sucursal = new Sucursal({
          nombre: 'Sucursal Principal',
          direccion: 'Calle Principal #123',
          telefono: '123456789'
        });
        await sucursal.save();
        console.log('Sucursal creada:', sucursal.nombre);
      } else {
        console.log('Usando sucursal existente:', sucursal.nombre);
      }
      
      // FORZAR: Eliminar usuario administrador si existe
      await Usuario.deleteOne({ usuario: 'admin' });
      console.log('Usuario admin eliminado (si existía)');
      
      // Crear nuevo usuario administrador con contraseña simple (sin encriptar)
      const admin = new Usuario({
        nombre: 'Administrador',
        usuario: 'admin',
        contrasena: 'admin123', // Sin encriptar
        rol: 'administrador',
        sucursal: sucursal._id,
        estado: 'activo'
      });
      
      await admin.save();
      console.log('Usuario administrador creado con contraseña sin encriptar. Usuario: admin, Contraseña: admin123');
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });