const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opcionProductoSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  ingrediente: {
    type: Schema.Types.ObjectId,
    ref: 'Ingrediente',
    required: true
  },
  es_predeterminado: {
    type: Boolean,
    default: true
  },
  es_removible: {
    type: Boolean,
    default: true
  },
  cantidad_predeterminada: {
    type: Number,
    default: 1,
    min: 0
  }
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
  }
});

// Índices compuestos para mejorar las consultas y evitar duplicados
opcionProductoSchema.index({ producto: 1, ingrediente: 1 }, { unique: true });

const OpcionProducto = mongoose.model('OpcionProducto', opcionProductoSchema);

module.exports = OpcionProducto;