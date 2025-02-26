const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  precio_base: {
    type: Number,
    required: true,
    min: 0,
    get: v => parseFloat(v.toFixed(2)),
    set: v => parseFloat(parseFloat(v).toFixed(2))
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  imagen: {
    type: String,
    trim: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  para_llevar: {
    type: String,
    enum: ['sí', 'no', 'ambos'],
    default: 'ambos'
  }
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
  }
});

// Índices para mejorar las consultas
productoSchema.index({ nombre: 1 });
productoSchema.index({ categoria: 1 });
productoSchema.index({ disponible: 1 });

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;