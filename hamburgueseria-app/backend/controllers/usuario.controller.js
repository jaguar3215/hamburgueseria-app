// controllers/usuario.controller.js
const Usuario = require('../models/Usuario');
const Sucursal = require('../models/Sucursal');

/**
 * Controlador para manejar operaciones CRUD de usuarios
 */
const UsuarioController = {
  /**
   * Obtener todos los usuarios (filtrados por sucursal según rol)
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  obtenerTodos: async (req, res) => {
    try {
      let consulta = {};
      
      // Si el usuario no es administrador, solo puede ver usuarios de su sucursal
      if (req.usuario.rol !== 'administrador') {
        consulta.sucursal = req.usuario.sucursal;
      }
      
      // Aplicar filtros de búsqueda
      const { rol, sucursal, estado, buscar } = req.query;
      
      // Si se especifica una sucursal en la consulta y el usuario es administrador
      if (sucursal && req.usuario.rol === 'administrador') {
        consulta.sucursal = sucursal;
      }
      
      // Filtrar por rol si se especifica
      if (rol) {
        consulta.rol = rol;
      }
      
      // Filtrar por estado si se especifica
      if (estado) {
        consulta.estado = estado;
      }
      
      // Buscar por nombre o usuario
      if (buscar) {
        consulta.$or = [
          { nombre: { $regex: buscar, $options: 'i' } },
          { usuario: { $regex: buscar, $options: 'i' } }
        ];
      }
      
      console.log('Consulta aplicada:', consulta); // Para depuración
      
      const usuarios = await Usuario.find(consulta)
        .select('-contrasena')
        .populate('sucursal', 'nombre direccion');

      return res.status(200).json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener usuarios', 
        error: error.message 
      });
    }
  },

  /**
   * Obtener un usuario por ID
   * @param {Object} req - Request con ID de usuario
   * @param {Object} res - Response
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const usuario = await Usuario.findById(id)
        .select('-contrasena')
        .populate('sucursal', 'nombre direccion');
      
      if (!usuario) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }
      
      // Verificar permisos: administradores pueden ver cualquier usuario,
      // otros roles solo pueden ver usuarios de su sucursal
      if (req.usuario.rol !== 'administrador' && 
          usuario.sucursal._id.toString() !== req.usuario.sucursal.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'No tienes permiso para ver este usuario' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: usuario
      });
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener usuario', 
        error: error.message 
      });
    }
  },

  /**
   * Crear un nuevo usuario
   * @param {Object} req - Request con datos del usuario
   * @param {Object} res - Response
   */
  crear: async (req, res) => {
    try {
      const { nombre, usuario, contrasena, rol, sucursal } = req.body;
      
      // Verificar campos requeridos
      if (!nombre || !usuario || !contrasena || !rol || !sucursal) {
        return res.status(400).json({ 
          success: false, 
          message: 'Todos los campos son requeridos' 
        });
      }
      
      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ usuario });
      if (usuarioExistente) {
        return res.status(400).json({ 
          success: false, 
          message: 'El nombre de usuario ya está en uso' 
        });
      }
      
      // Verificar si la sucursal existe
      const sucursalExistente = await Sucursal.findById(sucursal);
      if (!sucursalExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'La sucursal especificada no existe' 
        });
      }
      
      // Crear el nuevo usuario
      const nuevoUsuario = new Usuario({
        nombre,
        usuario,
        contrasena, // La contraseña se encriptará en el modelo
        rol,
        sucursal,
        estado: 'activo'
      });
      
      await nuevoUsuario.save();
      
      // Devolver el usuario creado sin la contraseña
      const usuarioCreado = await Usuario.findById(nuevoUsuario._id)
        .select('-contrasena')
        .populate('sucursal', 'nombre direccion');
      
      return res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: usuarioCreado
      });
    } catch (error) {
      console.error('Error en crear:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al crear usuario', 
        error: error.message 
      });
    }
  },

  /**
   * Actualizar un usuario existente
   * @param {Object} req - Request con ID y datos del usuario
   * @param {Object} res - Response
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, rol, sucursal, estado } = req.body;
      
      // Verificar si el usuario existe
      const usuarioExistente = await Usuario.findById(id);
      if (!usuarioExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }
      
      // Verificar permisos: administradores pueden actualizar cualquier usuario,
      // otros roles solo pueden actualizar su propio perfil y con limitaciones
      if (req.usuario.rol !== 'administrador') {
        if (id !== req.usuario.id) {
          return res.status(403).json({ 
            success: false, 
            message: 'No tienes permiso para actualizar este usuario' 
          });
        }
        
        // No-administradores no pueden cambiar rol, sucursal o estado
        if (rol || sucursal || estado) {
          return res.status(403).json({ 
            success: false, 
            message: 'No tienes permiso para modificar estos campos' 
          });
        }
      }
      
      // Si se especifica una sucursal, verificar que exista
      if (sucursal) {
        const sucursalExistente = await Sucursal.findById(sucursal);
        if (!sucursalExistente) {
          return res.status(404).json({ 
            success: false, 
            message: 'La sucursal especificada no existe' 
          });
        }
      }
      
      // Actualizar el usuario
      const datosActualizados = {};
      if (nombre) datosActualizados.nombre = nombre;
      if (rol && req.usuario.rol === 'administrador') datosActualizados.rol = rol;
      if (sucursal && req.usuario.rol === 'administrador') datosActualizados.sucursal = sucursal;
      if (estado && req.usuario.rol === 'administrador') datosActualizados.estado = estado;
      
      // Si se proporciona una nueva contraseña
      if (req.body.contrasena) {
        // La contraseña se encriptará en el modelo
        datosActualizados.contrasena = req.body.contrasena;
      }
      
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        id, 
        datosActualizados, 
        { new: true }
      )
        .select('-contrasena')
        .populate('sucursal', 'nombre direccion');
      
      return res.status(200).json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: usuarioActualizado
      });
    } catch (error) {
      console.error('Error en actualizar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar usuario', 
        error: error.message 
      });
    }
  },

  /**
   * Eliminar un usuario (desactivarlo)
   * @param {Object} req - Request con ID del usuario
   * @param {Object} res - Response
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si el usuario existe
      const usuarioExistente = await Usuario.findById(id);
      if (!usuarioExistente) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }
      
      // No permitir que un usuario se elimine a sí mismo
      if (id === req.usuario.id) {
        return res.status(400).json({ 
          success: false, 
          message: 'No puedes eliminar tu propio usuario' 
        });
      }
      
      // En lugar de eliminar físicamente, marcar como inactivo
      await Usuario.findByIdAndUpdate(id, { estado: 'inactivo' });
      
      return res.status(200).json({
        success: true,
        message: 'Usuario desactivado exitosamente'
      });
    } catch (error) {
      console.error('Error en eliminar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al eliminar usuario', 
        error: error.message 
      });
    }
  },

  /**
   * Autorizar acciones especiales mediante código
   * @param {Object} req - Request con código de autorización
   * @param {Object} res - Response
   */
  autorizar: async (req, res) => {
    try {
      const { codigo } = req.body;
      
      if (!codigo) {
        return res.status(400).json({ 
          success: false, 
          message: 'El código de autorización es requerido' 
        });
      }
      
      // Buscar un administrador con este código de autorización
      const administrador = await Usuario.findOne({
        rol: 'administrador',
        codigo_autorizacion: codigo,
        estado: 'activo'
      });
      
      if (!administrador) {
        return res.status(401).json({ 
          success: false, 
          message: 'Código de autorización inválido' 
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Autorización concedida',
        data: {
          autorizado_por: administrador.nombre
        }
      });
    } catch (error) {
      console.error('Error en autorizar:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al verificar autorización', 
        error: error.message 
      });
    }
  }
};

module.exports = UsuarioController;