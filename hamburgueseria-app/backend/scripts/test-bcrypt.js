// scripts/test-bcrypt.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

async function testBcrypt() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hamburgueseria');
    
    // Importar modelo de Usuario
    const Usuario = require('../models/Usuario');
    
    // Buscar el usuario admin
    const admin = await Usuario.findOne({ usuario: 'admin' });
    if (!admin) {
      console.log('Usuario admin no encontrado');
      return;
    }
    
    console.log('Usuario encontrado:', admin.usuario);
    console.log('Contraseña encriptada:', admin.contrasena);
    
    // Probar contraseña correcta
    const plainPassword = 'admin123';
    console.log('Intentando comparar con:', plainPassword);
    const isMatch = await bcrypt.compare(plainPassword, admin.contrasena);
    console.log(`Comparación de '${plainPassword}' con contraseña encriptada:`, isMatch);
    
    // Probar contraseña incorrecta
    const wrongPassword = 'password123';
    const isWrongMatch = await bcrypt.compare(wrongPassword, admin.contrasena);
    console.log(`Comparación de '${wrongPassword}' con contraseña encriptada:`, isWrongMatch);
    
    // Crear nueva contraseña encriptada y compararla
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(plainPassword, salt);
    console.log('Nueva contraseña encriptada:', newHash);
    
    // Comprobar si el método verificarContrasena del modelo funciona
    console.log('Probando método verificarContrasena del modelo:');
    const isValidWithMethod = await admin.verificarContrasena(plainPassword);
    console.log('verificarContrasena con contraseña correcta:', isValidWithMethod);
    
    // Opcionalmente actualizar la contraseña del usuario admin
    const updatePassword = true; // cambiar a true para actualizar la contraseña
    
    if (updatePassword) {
      // Actualizar manualmente sin usar middleware
      admin.contrasena = newHash;
      await admin.save({ validateBeforeSave: false }); // Evitar encriptación adicional
      console.log('Contraseña actualizada manualmente');
      
      // Verificar después de actualizar
      const adminUpdated = await Usuario.findOne({ usuario: 'admin' });
      const isMatchAfterUpdate = await bcrypt.compare(plainPassword, adminUpdated.contrasena);
      console.log('Comparación después de actualización manual:', isMatchAfterUpdate);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testBcrypt();