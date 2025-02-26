const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredienteSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  precio_adicional: {
    type: Number,
    default: 0,
    min: 0,
    get: v => parseFloat(v.toFixed(2)),
    set: v => parseFloat(parseFloat(v).toFixed(2))
  },
  disponible: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  stock_minimo: {
    type: Number,
    default: 10,
    min: 0
  },
  unidad_medida: {
    type: String,
    trim: true
  }
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
  }
});

// Índices para mejorar las consultas
ingredienteSchema.index({ nombre: 1 }, { unique: true });
ingredienteSchema.index({ disponible: 1 });
ingredienteSchema.index({ stock: 1 });

const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);

module.exports = Ingrediente;