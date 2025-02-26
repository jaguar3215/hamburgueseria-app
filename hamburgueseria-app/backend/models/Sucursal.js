const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sucursalSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  administrador_principal: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  estado: {
    type: String,
    enum: ['activa', 'inactiva'],
    default: 'activa'
  }
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
  }
});

// Índices para mejorar las consultas
sucursalSchema.index({ nombre: 1 }, { unique: true });

const Sucursal = mongoose.model('Sucursal', sucursalSchema);

module.exports = Sucursal;