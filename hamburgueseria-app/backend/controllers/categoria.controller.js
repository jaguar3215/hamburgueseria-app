// controllers/categoria.controller.js
const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');

/**
 * Controlador para manejar operaciones CRUD de categorías de productos
 */
const CategoriaController = {
  /**
   * Obtener todas las categorías
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  obtenerTodas: async (req, res) => {
    try {
      const categorias = await Categoria.find();
      
      return res.status(200).json({
        success: true,
        data: categorias
      });
    } catch (error) {
      console.error('Error en obtenerTodas:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener categorías', 
        error: error.message 
      });
    }
  },

  /**
   * Obtener una categoría por ID
   * @param {Object} req - Request con ID de categoría
   * @param {Object} res - Response
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const categoria = await Categoria.findById(id);
      
      if (!categoria) {
        return res.status(404).json({ 
          success: false, 
          message: 'Categoría no encontrada' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: categoria
      });
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener categoría', 
        error: error.message 
      });
    }
  },

  /**
   * Crear una nueva categoría
   * @param {Object} req - Request con datos de la categoría
   * @param {Object} res - Response
   */
  crear: async (req, res) => {
    try {
      const { nombre, descripcion } = req.body;
      
      // Verificar campos requeridos
      if (!nombre) {
        return res.status(400).json({ 
          success: false, 
          message: 'El nombre de la categoría es requerido' 
        });
      }
      
      // Verificar si ya existe una categoría con ese nombre
      const categoriaExistente = await Categoria.findOne({ nombre });
      if (categoriaExistente) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ya existe una categoría con este nombre' 
        });
      }
      
      // Crear la nueva categoría
      const nuevaCategoria = new Categoria({
        nombre,
        descripcion: descripcion || ''
      });
      
      await nuevaCategoria.save();
      
      return res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: nuevaCategoria
      });
    } catch (error) {
      console.error('Error en crear:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al crear categoría', 
        error: error.message 
      });
    }
  },

  /**
   * Actualizar una categoría existente
   * @param {Object} req - Request con ID y datos de la categoría
   * @param {Object} res - Response
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;
      
      // Verificar si la categoría existe
      const categoriaExistente = await Categoria.findById(id);
      if (!categoriaExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Categoría no encontrada' 
        });
      }
      
      // Si se cambia el nombre, verificar que no exista otro con ese nombre
      if (nombre && nombre !== categoriaExistente.nombre) {
        const nombreDuplicado = await Categoria.findOne({ nombre });
        if (nombreDuplicado) {
          return res.status(400).json({ 
            success: false, 
            message: 'Ya existe una categoría con este nombre' 
          });
        }
      }
      
      // Actualizar la categoría
      const datosActualizados = {};
      if (nombre) datosActualizados.nombre = nombre;
      if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
      
      const categoriaActualizada = await Categoria.findByIdAndUpdate(
        id, 
        datosActualizados, 
        { new: true }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: categoriaActualizada
      });
    } catch (error) {
      console.error('Error en actualizar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar categoría', 
        error: error.message 
      });
    }
  },

  /**
   * Eliminar una categoría
   * @param {Object} req - Request con ID de la categoría
   * @param {Object} res - Response
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si la categoría existe
      const categoriaExistente = await Categoria.findById(id);
      if (!categoriaExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Categoría no encontrada' 
        });
      }
      
      // Verificar si hay productos asociados a esta categoría
      const productosAsociados = await Producto.countDocuments({ categoria: id });
      if (productosAsociados > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `No se puede eliminar la categoría porque tiene ${productosAsociados} productos asociados` 
        });
      }
      
      // Eliminar la categoría
      await Categoria.findByIdAndDelete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error en eliminar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al eliminar categoría', 
        error: error.message 
      });
    }
  }
};

module.exports = CategoriaController;