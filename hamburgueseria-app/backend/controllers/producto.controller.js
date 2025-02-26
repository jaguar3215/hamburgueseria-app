// controllers/producto.controller.js
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const OpcionProducto = require('../models/OpcionProducto');
const Ingrediente = require('../models/Ingrediente');

/**
 * Controlador para manejar operaciones CRUD de productos
 */
const ProductoController = {
  /**
   * Obtener todos los productos
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  obtenerTodos: async (req, res) => {
    try {
      // Construir filtro basado en query params
      const filtro = {};
      
      // Filtrar por disponibilidad
      if (req.query.disponible !== undefined) {
        filtro.disponible = req.query.disponible === 'true';
      }
      
      // Filtrar por categoría
      if (req.query.categoria) {
        filtro.categoria = req.query.categoria;
      }
      
      // Filtrar por para_llevar
      if (req.query.para_llevar) {
        filtro.para_llevar = req.query.para_llevar;
      }
      
      const productos = await Producto.find(filtro)
        .populate('categoria', 'nombre descripcion');
      
      return res.status(200).json({
        success: true,
        data: productos
      });
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener productos', 
        error: error.message 
      });
    }
  },

  /**
   * Obtener un producto por ID
   * @param {Object} req - Request con ID de producto
   * @param {Object} res - Response
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const producto = await Producto.findById(id)
        .populate('categoria', 'nombre descripcion');
      
      if (!producto) {
        return res.status(404).json({ 
          success: false, 
          message: 'Producto no encontrado' 
        });
      }
      
      // Obtener opciones de ingredientes asociadas al producto
      const opcionesIngredientes = await OpcionProducto.find({ producto: id })
        .populate('ingrediente', 'nombre precio_adicional disponible stock');
      
      return res.status(200).json({
        success: true,
        data: {
          producto,
          opciones_ingredientes: opcionesIngredientes
        }
      });
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener producto', 
        error: error.message 
      });
    }
  },

  /**
   * Crear un nuevo producto
   * @param {Object} req - Request con datos del producto
   * @param {Object} res - Response
   */
  crear: async (req, res) => {
    try {
      const { 
        nombre, 
        descripcion, 
        precio_base, 
        categoria, 
        imagen, 
        disponible, 
        para_llevar,
        ingredientes 
      } = req.body;
      
      // Verificar campos requeridos
      if (!nombre || !precio_base || !categoria) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nombre, precio base y categoría son requeridos' 
        });
      }
      
      // Verificar si la categoría existe
      const categoriaExistente = await Categoria.findById(categoria);
      if (!categoriaExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'La categoría especificada no existe' 
        });
      }
      
      // Crear el nuevo producto
      const nuevoProducto = new Producto({
        nombre,
        descripcion: descripcion || '',
        precio_base,
        categoria,
        imagen: imagen || '',
        disponible: disponible !== undefined ? disponible : true,
        para_llevar: para_llevar || 'ambos'
      });
      
      await nuevoProducto.save();
      
      // Si se proporcionaron ingredientes, añadirlos como opciones del producto
      if (ingredientes && Array.isArray(ingredientes) && ingredientes.length > 0) {
        const opcionesIngredientes = [];
        
        for (const opcion of ingredientes) {
          // Verificar si el ingrediente existe
          const ingredienteExistente = await Ingrediente.findById(opcion.ingrediente);
          if (!ingredienteExistente) {
            console.warn(`Ingrediente con ID ${opcion.ingrediente} no encontrado, se omitirá`);
            continue;
          }
          
          // Crear la opción de producto
          const nuevaOpcion = new OpcionProducto({
            producto: nuevoProducto._id,
            ingrediente: opcion.ingrediente,
            es_predeterminado: opcion.es_predeterminado !== undefined ? opcion.es_predeterminado : true,
            es_removible: opcion.es_removible !== undefined ? opcion.es_removible : true,
            cantidad_predeterminada: opcion.cantidad_predeterminada || 1
          });
          
          await nuevaOpcion.save();
          opcionesIngredientes.push(nuevaOpcion);
        }
        
        // Devolver el producto con sus opciones de ingredientes
        const productoCreado = await Producto.findById(nuevoProducto._id)
          .populate('categoria', 'nombre descripcion');
          
        const opcionesPopuladas = await OpcionProducto.find({ producto: nuevoProducto._id })
          .populate('ingrediente', 'nombre precio_adicional disponible');
        
        return res.status(201).json({
          success: true,
          message: 'Producto creado exitosamente',
          data: {
            producto: productoCreado,
            opciones_ingredientes: opcionesPopuladas
          }
        });
      } else {
        // Si no se proporcionaron ingredientes, solo devolver el producto
        const productoCreado = await Producto.findById(nuevoProducto._id)
          .populate('categoria', 'nombre descripcion');
          
        return res.status(201).json({
          success: true,
          message: 'Producto creado exitosamente',
          data: {
            producto: productoCreado,
            opciones_ingredientes: []
          }
        });
      }
    } catch (error) {
      console.error('Error en crear:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al crear producto', 
        error: error.message 
      });
    }
  },

  /**
   * Actualizar un producto existente
   * @param {Object} req - Request con ID y datos del producto
   * @param {Object} res - Response
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        nombre, 
        descripcion, 
        precio_base, 
        categoria, 
        imagen, 
        disponible, 
        para_llevar 
      } = req.body;
      
      // Verificar si el producto existe
      const productoExistente = await Producto.findById(id);
      if (!productoExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Producto no encontrado' 
        });
      }
      
      // Si se cambia la categoría, verificar que exista
      if (categoria && categoria !== productoExistente.categoria.toString()) {
        const categoriaExistente = await Categoria.findById(categoria);
        if (!categoriaExistente) {
          return res.status(404).json({ 
            success: false, 
            message: 'La categoría especificada no existe' 
          });
        }
      }
      
      // Actualizar el producto
      const datosActualizados = {};
      if (nombre) datosActualizados.nombre = nombre;
      if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
      if (precio_base !== undefined) datosActualizados.precio_base = precio_base;
      if (categoria) datosActualizados.categoria = categoria;
      if (imagen !== undefined) datosActualizados.imagen = imagen;
      if (disponible !== undefined) datosActualizados.disponible = disponible;
      if (para_llevar) datosActualizados.para_llevar = para_llevar;
      
      const productoActualizado = await Producto.findByIdAndUpdate(
        id, 
        datosActualizados, 
        { new: true }
      ).populate('categoria', 'nombre descripcion');
      
      // Obtener opciones de ingredientes actualizadas
      const opcionesIngredientes = await OpcionProducto.find({ producto: id })
        .populate('ingrediente', 'nombre precio_adicional disponible stock');
      
      return res.status(200).json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: {
          producto: productoActualizado,
          opciones_ingredientes: opcionesIngredientes
        }
      });
    } catch (error) {
      console.error('Error en actualizar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar producto', 
        error: error.message 
      });
    }
  },

  /**
   * Eliminar un producto
   * @param {Object} req - Request con ID del producto
   * @param {Object} res - Response
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si el producto existe
      const productoExistente = await Producto.findById(id);
      if (!productoExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Producto no encontrado' 
        });
      }
      
      // Eliminar opciones de ingredientes asociadas al producto
      await OpcionProducto.deleteMany({ producto: id });
      
      // Eliminar el producto
      await Producto.findByIdAndDelete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Producto y sus opciones eliminados exitosamente'
      });
    } catch (error) {
      console.error('Error en eliminar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al eliminar producto', 
        error: error.message 
      });
    }
  },

  /**
   * Actualizar opciones de ingredientes de un producto
   * @param {Object} req - Request con ID del producto y nuevas opciones
   * @param {Object} res - Response
   */
  actualizarOpciones: async (req, res) => {
    try {
      const { id } = req.params;
      const { opciones } = req.body;
      
      // Verificar si el producto existe
      const productoExistente = await Producto.findById(id);
      if (!productoExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Producto no encontrado' 
        });
      }
      
      // Verificar que se proporcionaron opciones
      if (!opciones || !Array.isArray(opciones)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Se requiere un array de opciones de ingredientes' 
        });
      }
      
      // Obtener opciones actuales para compararlas
      const opcionesActuales = await OpcionProducto.find({ producto: id });
      
      // Crear un mapa de opciones actuales para facilitar la búsqueda
      const mapaOpcionesActuales = new Map();
      opcionesActuales.forEach(opcion => {
        mapaOpcionesActuales.set(opcion.ingrediente.toString(), opcion);
      });
      
      // Procesar cada opción recibida
      const opcionesActualizadas = [];
      
      for (const opcion of opciones) {
        // Verificar si el ingrediente existe
        const ingredienteExistente = await Ingrediente.findById(opcion.ingrediente);
        if (!ingredienteExistente) {
          console.warn(`Ingrediente con ID ${opcion.ingrediente} no encontrado, se omitirá`);
          continue;
        }
        
        const ingredienteId = opcion.ingrediente.toString();
        
        // Si ya existe una opción para este ingrediente, actualizarla
        if (mapaOpcionesActuales.has(ingredienteId)) {
          const opcionExistente = mapaOpcionesActuales.get(ingredienteId);
          
          opcionExistente.es_predeterminado = opcion.es_predeterminado !== undefined 
            ? opcion.es_predeterminado 
            : opcionExistente.es_predeterminado;
            
          opcionExistente.es_removible = opcion.es_removible !== undefined 
            ? opcion.es_removible 
            : opcionExistente.es_removible;
            
          opcionExistente.cantidad_predeterminada = opcion.cantidad_predeterminada || opcionExistente.cantidad_predeterminada;
          
          await opcionExistente.save();
          opcionesActualizadas.push(opcionExistente);
          
          // Marcar como procesada
          mapaOpcionesActuales.delete(ingredienteId);
        } else {
          // Si no existe, crear una nueva opción
          const nuevaOpcion = new OpcionProducto({
            producto: id,
            ingrediente: opcion.ingrediente,
            es_predeterminado: opcion.es_predeterminado !== undefined ? opcion.es_predeterminado : true,
            es_removible: opcion.es_removible !== undefined ? opcion.es_removible : true,
            cantidad_predeterminada: opcion.cantidad_predeterminada || 1
          });
          
          await nuevaOpcion.save();
          opcionesActualizadas.push(nuevaOpcion);
        }
      }
      
      // Eliminar opciones que ya no están en la lista
      for (const [ingredienteId, opcion] of mapaOpcionesActuales.entries()) {
        await OpcionProducto.findByIdAndDelete(opcion._id);
      }
      
      // Obtener todas las opciones actualizadas y pobladas
      const opcionesFinales = await OpcionProducto.find({ producto: id })
        .populate('ingrediente', 'nombre precio_adicional disponible stock');
      
      return res.status(200).json({
        success: true,
        message: 'Opciones de ingredientes actualizadas exitosamente',
        data: opcionesFinales
      });
    } catch (error) {
      console.error('Error en actualizarOpciones:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar opciones de ingredientes', 
        error: error.message 
      });
    }
  }
};

module.exports = ProductoController;