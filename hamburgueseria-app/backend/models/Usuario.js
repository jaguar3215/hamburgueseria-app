// models/Usuario.js
const mongoose = require('mongoose');
// Mantener la referencia a bcrypt aunque no lo usemos por ahora
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['administrador', 'cajero', 'cocinero'],
    required: true
  },
  sucursal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sucursal',
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  codigo_autorizacion: {
    type: String
  }
}, { timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' } });

// Método simplificado para verificar contraseña (sin encriptación)
usuarioSchema.methods.verificarContrasena = function(contrasena) {
  return this.contrasena === contrasena;
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;