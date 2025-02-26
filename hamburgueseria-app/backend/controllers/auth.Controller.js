// controllers/auth.controller.js
const Usuario = require('../models/Usuario');
const { generarToken } = require('../utils/auth.utils');

/**
 * Controlador para manejar la autenticación de usuarios
 */
const AuthController = {
  /**
   * Iniciar sesión
   * @param {Object} req - Request con usuario y contraseña
   * @param {Object} res - Response
   */
  login: async (req, res) => {
    try {
      const { usuario, contrasena } = req.body;
      
      console.log('Intento de login:', { usuario });
      console.log('Contraseña recibida:', contrasena);

      // Comprobar campos requeridos
      if (!usuario || !contrasena) {
        console.log('Falta usuario o contraseña');
        return res.status(400).json({ 
          success: false, 
          message: 'Usuario y contraseña son requeridos' 
        });
      }

      // Buscar usuario en la base de datos
      const usuarioEncontrado = await Usuario.findOne({ usuario });
      
      console.log('Usuario encontrado:', usuarioEncontrado ? 'Sí' : 'No');
      
      if (!usuarioEncontrado) {
        console.log('Usuario no encontrado en la base de datos');
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales inválidas' 
        });
      }

      console.log('Detalles del usuario:', {
        id: usuarioEncontrado._id,
        nombre: usuarioEncontrado.nombre,
        rol: usuarioEncontrado.rol,
        estado: usuarioEncontrado.estado
      });
      
      console.log('Contraseña almacenada (encriptada):', usuarioEncontrado.contrasena);
      console.log('Contraseña proporcionada para comparar:', contrasena);

      // Verificar si el usuario está activo
      if (usuarioEncontrado.estado !== 'activo') {
        console.log('Usuario desactivado');
        return res.status(401).json({ 
          success: false, 
          message: 'Este usuario ha sido desactivado' 
        });
      }

      // Verificar contraseña
      const contrasenaValida = await usuarioEncontrado.verificarContrasena(contrasena);
      
      console.log('Resultado de bcrypt.compare:', contrasenaValida);
      
      if (!contrasenaValida) {
        console.log('Contraseña inválida');
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales inválidas' 
        });
      }

      console.log('Autenticación exitosa, generando token');

      // Cargar datos de sucursal si no están poblados
      if (!usuarioEncontrado.populated('sucursal')) {
        await usuarioEncontrado.populate('sucursal');
      }

      // Generar token de autenticación
      const token = generarToken({
        id: usuarioEncontrado._id,
        usuario: usuarioEncontrado.usuario,
        nombre: usuarioEncontrado.nombre,
        rol: usuarioEncontrado.rol,
        sucursal: usuarioEncontrado.sucursal._id
      });

      console.log('Token generado exitosamente');

      // Devolver información del usuario y token
      return res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          usuario: {
            id: usuarioEncontrado._id,
            nombre: usuarioEncontrado.nombre,
            usuario: usuarioEncontrado.usuario,
            rol: usuarioEncontrado.rol,
            sucursal: {
              id: usuarioEncontrado.sucursal._id,
              nombre: usuarioEncontrado.sucursal.nombre
            }
          },
          token
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al iniciar sesión', 
        error: error.message 
      });
    }
  },

  /**
   * Verificar token de autenticación
   * @param {Object} req - Request con token en headers
   * @param {Object} res - Response
   */
  verificarToken: async (req, res) => {
    try {
      // El middleware de autenticación ya verificó el token
      // Solo necesitamos devolver la información del usuario
      const usuarioEncontrado = await Usuario.findById(req.usuario.id)
        .populate('sucursal')
        .select('-contrasena');

      if (!usuarioEncontrado) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          usuario: {
            id: usuarioEncontrado._id,
            nombre: usuarioEncontrado.nombre,
            usuario: usuarioEncontrado.usuario,
            rol: usuarioEncontrado.rol,
            sucursal: {
              id: usuarioEncontrado.sucursal._id,
              nombre: usuarioEncontrado.sucursal.nombre
            }
          }
        }
      });
    } catch (error) {
      console.error('Error en verificarToken:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al verificar token', 
        error: error.message 
      });
    }
  }
};

module.exports = AuthController;