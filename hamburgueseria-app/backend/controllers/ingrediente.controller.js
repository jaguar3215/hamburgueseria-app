// controllers/ingrediente.controller.js
const Ingrediente = require('../models/Ingrediente');
const OpcionProducto = require('../models/OpcionProducto');

/**
 * Controlador para manejar operaciones CRUD de ingredientes
 */
const IngredienteController = {
  /**
   * Obtener todos los ingredientes
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  obtenerTodos: async (req, res) => {
    try {
      // Filtrar por disponibilidad si se especifica
      const filtro = {};
      if (req.query.disponible !== undefined) {
        filtro.disponible = req.query.disponible === 'true';
      }
      
      const ingredientes = await Ingrediente.find(filtro);
      
      return res.status(200).json({
        success: true,
        data: ingredientes
      });
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener ingredientes', 
        error: error.message 
      });
    }
  },

  /**
   * Obtener un ingrediente por ID
   * @param {Object} req - Request con ID de ingrediente
   * @param {Object} res - Response
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const ingrediente = await Ingrediente.findById(id);
      
      if (!ingrediente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Ingrediente no encontrado' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: ingrediente
      });
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener ingrediente', 
        error: error.message 
      });
    }
  },

  /**
   * Crear un nuevo ingrediente
   * @param {Object} req - Request con datos del ingrediente
   * @param {Object} res - Response
   */
  crear: async (req, res) => {
    try {
      const { 
        nombre, 
        precio_adicional, 
        disponible, 
        stock, 
        stock_minimo, 
        unidad_medida 
      } = req.body;
      
      // Verificar campos requeridos
      if (!nombre) {
        return res.status(400).json({ 
          success: false, 
          message: 'El nombre del ingrediente es requerido' 
        });
      }
      
      // Verificar si ya existe un ingrediente con ese nombre
      const ingredienteExistente = await Ingrediente.findOne({ nombre });
      if (ingredienteExistente) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ya existe un ingrediente con este nombre' 
        });
      }
      
      // Crear el nuevo ingrediente
      const nuevoIngrediente = new Ingrediente({
        nombre,
        precio_adicional: precio_adicional || 0,
        disponible: disponible !== undefined ? disponible : true,
        stock: stock || 0,
        stock_minimo: stock_minimo || 10,
        unidad_medida: unidad_medida || ''
      });
      
      await nuevoIngrediente.save();
      
      return res.status(201).json({
        success: true,
        message: 'Ingrediente creado exitosamente',
        data: nuevoIngrediente
      });
    } catch (error) {
      console.error('Error en crear:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al crear ingrediente', 
        error: error.message 
      });
    }
  },

  /**
   * Actualizar un ingrediente existente
   * @param {Object} req - Request con ID y datos del ingrediente
   * @param {Object} res - Response
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        nombre, 
        precio_adicional, 
        disponible, 
        stock, 
        stock_minimo, 
        unidad_medida 
      } = req.body;
      
      // Verificar si el ingrediente existe
      const ingredienteExistente = await Ingrediente.findById(id);
      if (!ingredienteExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Ingrediente no encontrado' 
        });
      }
      
      // Si se cambia el nombre, verificar que no exista otro con ese nombre
      if (nombre && nombre !== ingredienteExistente.nombre) {
        const nombreDuplicado = await Ingrediente.findOne({ nombre });
        if (nombreDuplicado) {
          return res.status(400).json({ 
            success: false, 
            message: 'Ya existe un ingrediente con este nombre' 
          });
        }
      }
      
      // Actualizar el ingrediente
      const datosActualizados = {};
      if (nombre) datosActualizados.nombre = nombre;
      if (precio_adicional !== undefined) datosActualizados.precio_adicional = precio_adicional;
      if (disponible !== undefined) datosActualizados.disponible = disponible;
      if (stock !== undefined) datosActualizados.stock = stock;
      if (stock_minimo !== undefined) datosActualizados.stock_minimo = stock_minimo;
      if (unidad_medida !== undefined) datosActualizados.unidad_medida = unidad_medida;
      
      const ingredienteActualizado = await Ingrediente.findByIdAndUpdate(
        id, 
        datosActualizados, 
        { new: true }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Ingrediente actualizado exitosamente',
        data: ingredienteActualizado
      });
    } catch (error) {
      console.error('Error en actualizar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar ingrediente', 
        error: error.message 
      });
    }
  },

  /**
   * Eliminar un ingrediente
   * @param {Object} req - Request con ID del ingrediente
   * @param {Object} res - Response
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si el ingrediente existe
      const ingredienteExistente = await Ingrediente.findById(id);
      if (!ingredienteExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Ingrediente no encontrado' 
        });
      }
      
      // Verificar si hay opciones de producto que usan este ingrediente
      const opcionesAsociadas = await OpcionProducto.countDocuments({ ingrediente: id });
      if (opcionesAsociadas > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `No se puede eliminar el ingrediente porque está asociado a ${opcionesAsociadas} opciones de producto` 
        });
      }
      
      // Eliminar el ingrediente
      await Ingrediente.findByIdAndDelete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Ingrediente eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en eliminar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al eliminar ingrediente', 
        error: error.message 
      });
    }
  },

  /**
   * Actualizar el stock de un ingrediente
   * @param {Object} req - Request con ID y cantidad a actualizar
   * @param {Object} res - Response
   */
  actualizarStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { cantidad, operacion } = req.body;
      
      // Verificar campos requeridos
      if (cantidad === undefined || !operacion) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cantidad y operación son requeridos' 
        });
      }
      
      // Verificar operación válida
      if (!['agregar', 'restar'].includes(operacion)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Operación inválida. Debe ser "agregar" o "restar"' 
        });
      }
      
      // Verificar si el ingrediente existe
      const ingredienteExistente = await Ingrediente.findById(id);
      if (!ingredienteExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Ingrediente no encontrado' 
        });
      }
      
      // Actualizar el stock según la operación
      let nuevoStock;
      if (operacion === 'agregar') {
        nuevoStock = ingredienteExistente.stock + cantidad;
      } else {
        nuevoStock = ingredienteExistente.stock - cantidad;
        // No permitir stock negativo
        if (nuevoStock < 0) {
          return res.status(400).json({ 
            success: false, 
            message: 'Stock insuficiente para realizar esta operación' 
          });
        }
      }
      
      // Actualizar el ingrediente con el nuevo stock
      const ingredienteActualizado = await Ingrediente.findByIdAndUpdate(
        id, 
        { 
          stock: nuevoStock,
          // Actualizar disponibilidad automáticamente según el stock
          disponible: nuevoStock > 0
        }, 
        { new: true }
      );
      
      // Verificar si el stock está por debajo del mínimo
      const alertaStockBajo = ingredienteActualizado.stock < ingredienteActualizado.stock_minimo;
      
      return res.status(200).json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: {
          ingrediente: ingredienteActualizado,
          alerta_stock_bajo: alertaStockBajo
        }
      });
    } catch (error) {
      console.error('Error en actualizarStock:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar stock', 
        error: error.message 
      });
    }
  }
};

module.exports = IngredienteController;