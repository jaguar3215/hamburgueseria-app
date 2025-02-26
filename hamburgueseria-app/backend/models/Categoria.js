const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
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
categoriaSchema.index({ nombre: 1 }, { unique: true });

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;