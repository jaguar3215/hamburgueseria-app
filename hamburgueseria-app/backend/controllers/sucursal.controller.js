// controllers/sucursal.controller.js
const Sucursal = require('../models/Sucursal');
const Usuario = require('../models/Usuario');

/**
 * Controlador para manejar operaciones CRUD de sucursales
 */
const SucursalController = {
  /**
   * Obtener todas las sucursales
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  obtenerTodas: async (req, res) => {
    try {
      // Filtrar por estado si se especifica
      const filtro = {};
      if (req.query.estado) {
        filtro.estado = req.query.estado;
      }

      const sucursales = await Sucursal.find(filtro)
        .populate('administrador_principal', 'nombre usuario');
        
      return res.status(200).json({
        success: true,
        data: sucursales
      });
    } catch (error) {
      console.error('Error en obtenerTodas:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener sucursales', 
        error: error.message 
      });
    }
  },

  /**
   * Obtener una sucursal por ID
   * @param {Object} req - Request con ID de sucursal
   * @param {Object} res - Response
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const sucursal = await Sucursal.findById(id)
        .populate('administrador_principal', 'nombre usuario');
      
      if (!sucursal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Sucursal no encontrada' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: sucursal
      });
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener sucursal', 
        error: error.message 
      });
    }
  },

  /**
   * Crear una nueva sucursal
   * @param {Object} req - Request con datos de la sucursal
   * @param {Object} res - Response
   */
  crear: async (req, res) => {
    try {
      const { nombre, direccion, telefono, administrador_principal } = req.body;
      
      // Verificar campos requeridos
      if (!nombre || !direccion || !telefono) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nombre, dirección y teléfono son requeridos' 
        });
      }
      
      // Verificar si el nombre ya existe
      const sucursalExistente = await Sucursal.findOne({ nombre });
      if (sucursalExistente) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ya existe una sucursal con este nombre' 
        });
      }
      
      // Verificar si el administrador principal existe
      if (administrador_principal) {
        const adminExistente = await Usuario.findById(administrador_principal);
        if (!adminExistente) {
          return res.status(404).json({ 
            success: false, 
            message: 'El administrador especificado no existe' 
          });
        }
        
        // Verificar que el usuario sea un administrador
        if (adminExistente.rol !== 'administrador') {
          return res.status(400).json({ 
            success: false, 
            message: 'El usuario especificado no tiene rol de administrador' 
          });
        }
      }
      
      // Crear la nueva sucursal
      const nuevaSucursal = new Sucursal({
        nombre,
        direccion,
        telefono,
        administrador_principal: administrador_principal || null,
        estado: 'activa'
      });
      
      await nuevaSucursal.save();
      
      // Devolver la sucursal creada con el administrador poblado
      const sucursalCreada = await Sucursal.findById(nuevaSucursal._id)
        .populate('administrador_principal', 'nombre usuario');
      
      return res.status(201).json({
        success: true,
        message: 'Sucursal creada exitosamente',
        data: sucursalCreada
      });
    } catch (error) {
      console.error('Error en crear:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al crear sucursal', 
        error: error.message 
      });
    }
  },

  /**
   * Actualizar una sucursal existente
   * @param {Object} req - Request con ID y datos de la sucursal
   * @param {Object} res - Response
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, direccion, telefono, administrador_principal, estado } = req.body;
      
      // Verificar si la sucursal existe
      const sucursalExistente = await Sucursal.findById(id);
      if (!sucursalExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Sucursal no encontrada' 
        });
      }
      
      // Si se cambia el nombre, verificar que no exista otro con ese nombre
      if (nombre && nombre !== sucursalExistente.nombre) {
        const nombreDuplicado = await Sucursal.findOne({ nombre });
        if (nombreDuplicado) {
          return res.status(400).json({ 
            success: false, 
            message: 'Ya existe una sucursal con este nombre' 
          });
        }
      }
      
      // Si se cambia el administrador, verificar que exista y sea administrador
      if (administrador_principal) {
        const adminExistente = await Usuario.findById(administrador_principal);
        if (!adminExistente) {
          return res.status(404).json({ 
            success: false, 
            message: 'El administrador especificado no existe' 
          });
        }
        
        // Verificar que el usuario sea un administrador
        if (adminExistente.rol !== 'administrador') {
          return res.status(400).json({ 
            success: false, 
            message: 'El usuario especificado no tiene rol de administrador' 
          });
        }
      }
      
      // Actualizar la sucursal
      const datosActualizados = {};
      if (nombre) datosActualizados.nombre = nombre;
      if (direccion) datosActualizados.direccion = direccion;
      if (telefono) datosActualizados.telefono = telefono;
      if (administrador_principal) datosActualizados.administrador_principal = administrador_principal;
      if (estado && ['activa', 'inactiva'].includes(estado)) datosActualizados.estado = estado;
      
      const sucursalActualizada = await Sucursal.findByIdAndUpdate(
        id, 
        datosActualizados, 
        { new: true }
      ).populate('administrador_principal', 'nombre usuario');
      
      return res.status(200).json({
        success: true,
        message: 'Sucursal actualizada exitosamente',
        data: sucursalActualizada
      });
    } catch (error) {
      console.error('Error en actualizar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar sucursal', 
        error: error.message 
      });
    }
  },

  /**
   * Desactivar una sucursal
   * @param {Object} req - Request con ID de la sucursal
   * @param {Object} res - Response
   */
  desactivar: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si la sucursal existe
      const sucursalExistente = await Sucursal.findById(id);
      if (!sucursalExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Sucursal no encontrada' 
        });
      }
      
      // Verificar si ya está inactiva
      if (sucursalExistente.estado === 'inactiva') {
        return res.status(400).json({ 
          success: false, 
          message: 'La sucursal ya está desactivada' 
        });
      }
      
      // Marcar como inactiva
      await Sucursal.findByIdAndUpdate(id, { estado: 'inactiva' });
      
      return res.status(200).json({
        success: true,
        message: 'Sucursal desactivada exitosamente'
      });
    } catch (error) {
      console.error('Error en desactivar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al desactivar sucursal', 
        error: error.message 
      });
    }
  }
};

module.exports = SucursalController;