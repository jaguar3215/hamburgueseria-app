// controllers/opcion-producto.controller.js
const OpcionProducto = require('../models/OpcionProducto');
const Producto = require('../models/Producto');
const Ingrediente = require('../models/Ingrediente');

/**
 * Controlador para manejar operaciones CRUD de opciones de producto
 */
const OpcionProductoController = {
  /**
   * Obtener todas las opciones de producto
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  obtenerTodas: async (req, res) => {
    try {
      // Filtrar por producto si se especifica
      const filtro = {};
      if (req.query.producto) {
        filtro.producto = req.query.producto;
      }
      
      // Filtrar por ingrediente si se especifica
      if (req.query.ingrediente) {
        filtro.ingrediente = req.query.ingrediente;
      }
      
      const opciones = await OpcionProducto.find(filtro)
        .populate('producto', 'nombre precio_base')
        .populate('ingrediente', 'nombre precio_adicional disponible');
      
      return res.status(200).json({
        success: true,
        data: opciones
      });
    } catch (error) {
      console.error('Error en obtenerTodas:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener opciones de producto', 
        error: error.message 
      });
    }
  },

  /**
   * Obtener todas las opciones de un producto específico
   * @param {Object} req - Request con ID de producto
   * @param {Object} res - Response
   */
  obtenerPorProducto: async (req, res) => {
    try {
      const { productoId } = req.params;
      
      // Verificar si el producto existe
      const productoExistente = await Producto.findById(productoId);
      if (!productoExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Producto no encontrado' 
        });
      }
      
      // Obtener todas las opciones del producto
      const opciones = await OpcionProducto.find({ producto: productoId })
        .populate('producto', 'nombre precio_base')
        .populate('ingrediente', 'nombre precio_adicional disponible stock');
      
      return res.status(200).json({
        success: true,
        data: opciones
      });
    } catch (error) {
      console.error('Error en obtenerPorProducto:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener opciones del producto', 
        error: error.message 
      });
    }
  },

  /**
   * Obtener una opción de producto por ID
   * @param {Object} req - Request con ID de opción
   * @param {Object} res - Response
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const opcion = await OpcionProducto.findById(id)
        .populate('producto', 'nombre precio_base')
        .populate('ingrediente', 'nombre precio_adicional disponible stock');
      
      if (!opcion) {
        return res.status(404).json({ 
          success: false, 
          message: 'Opción de producto no encontrada' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: opcion
      });
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener opción de producto', 
        error: error.message 
      });
    }
  },

  /**
   * Crear una nueva opción de producto
   * @param {Object} req - Request con datos de la opción
   * @param {Object} res - Response
   */
  crear: async (req, res) => {
    try {
      const { 
        producto, 
        ingrediente, 
        es_predeterminado, 
        es_removible, 
        cantidad_predeterminada 
      } = req.body;
      
      // Verificar campos requeridos
      if (!producto || !ingrediente) {
        return res.status(400).json({ 
          success: false, 
          message: 'Producto e ingrediente son requeridos' 
        });
      }
      
      // Verificar si el producto existe
      const productoExistente = await Producto.findById(producto);
      if (!productoExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'El producto especificado no existe' 
        });
      }
      
      // Verificar si el ingrediente existe
      const ingredienteExistente = await Ingrediente.findById(ingrediente);
      if (!ingredienteExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'El ingrediente especificado no existe' 
        });
      }
      
      // Verificar si ya existe esta combinación de producto e ingrediente
      const opcionExistente = await OpcionProducto.findOne({ producto, ingrediente });
      if (opcionExistente) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ya existe una opción para este producto con este ingrediente' 
        });
      }
      
      // Crear la nueva opción
      const nuevaOpcion = new OpcionProducto({
        producto,
        ingrediente,
        es_predeterminado: es_predeterminado !== undefined ? es_predeterminado : true,
        es_removible: es_removible !== undefined ? es_removible : true,
        cantidad_predeterminada: cantidad_predeterminada || 1
      });
      
      await nuevaOpcion.save();
      
      // Devolver la opción creada con producto e ingrediente poblados
      const opcionCreada = await OpcionProducto.findById(nuevaOpcion._id)
        .populate('producto', 'nombre precio_base')
        .populate('ingrediente', 'nombre precio_adicional disponible');
      
      return res.status(201).json({
        success: true,
        message: 'Opción de producto creada exitosamente',
        data: opcionCreada
      });
    } catch (error) {
      console.error('Error en crear:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al crear opción de producto', 
        error: error.message 
      });
    }
  },

  /**
   * Actualizar una opción de producto existente
   * @param {Object} req - Request con ID y datos de la opción
   * @param {Object} res - Response
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        es_predeterminado, 
        es_removible, 
        cantidad_predeterminada 
      } = req.body;
      
      // Verificar si la opción existe
      const opcionExistente = await OpcionProducto.findById(id);
      if (!opcionExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Opción de producto no encontrada' 
        });
      }
      
      // Actualizar la opción
      const datosActualizados = {};
      if (es_predeterminado !== undefined) datosActualizados.es_predeterminado = es_predeterminado;
      if (es_removible !== undefined) datosActualizados.es_removible = es_removible;
      if (cantidad_predeterminada !== undefined) datosActualizados.cantidad_predeterminada = cantidad_predeterminada;
      
      const opcionActualizada = await OpcionProducto.findByIdAndUpdate(
        id, 
        datosActualizados, 
        { new: true }
      )
        .populate('producto', 'nombre precio_base')
        .populate('ingrediente', 'nombre precio_adicional disponible');
      
      return res.status(200).json({
        success: true,
        message: 'Opción de producto actualizada exitosamente',
        data: opcionActualizada
      });
    } catch (error) {
      console.error('Error en actualizar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar opción de producto', 
        error: error.message 
      });
    }
  },

  /**
   * Eliminar una opción de producto
   * @param {Object} req - Request con ID de la opción
   * @param {Object} res - Response
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si la opción existe
      const opcionExistente = await OpcionProducto.findById(id);
      if (!opcionExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Opción de producto no encontrada' 
        });
      }
      
      // Eliminar la opción
      await OpcionProducto.findByIdAndDelete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Opción de producto eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error en eliminar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al eliminar opción de producto', 
        error: error.message 
      });
    }
  }
};

module.exports = OpcionProductoController;