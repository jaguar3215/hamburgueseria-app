const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

/**
 * Middleware para verificar el token JWT
 */
const verificarToken = (req, res, next) => {
  // Obtener el token del header
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    console.log('No se proporcionó header de autorización');
    return res.status(401).json({ 
      success: false,
      message: 'No se proporcionó token de autenticación' 
    });
  }
  
  // Extraer el token
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    console.log('Formato de token incorrecto:', authHeader);
    return res.status(401).json({ 
      success: false,
      message: 'Formato de token incorrecto' 
    });
  }
  
  const token = tokenParts[1];
  console.log('Token recibido:', token.substring(0, 15) + '...');

  try {
    // Verificar el token
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verificado correctamente para usuario ID:', decodificado.id);
    
    // Guardar el ID del usuario en el objeto request
    req.usuarioId = decodificado.id;
    req.rol = decodificado.rol;
    req.sucursalId = decodificado.sucursalId;
    
    next();
  } catch (error) {
    console.error('Error verificando token:', error.name, error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'El token ha expirado' 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: 'Token inválido' 
    });
  }
};

/**
 * Middleware para verificar roles de usuario
 * @param {Array} roles - Array de roles permitidos
 */
const verificarRol = (roles) => {
  return (req, res, next) => {
    if (!req.rol) {
      return res.status(403).json({ 
        success: false,
        message: 'Se requiere autenticación completa' 
      });
    }

    if (roles.includes(req.rol)) {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'No tiene permisos para acceder a este recurso' 
      });
    }
  };
};

/**
 * Middleware para verificar si el usuario existe y está activo
 */
const verificarUsuarioActivo = async (req, res, next) => {
  try {
    const usuario = await Usuario.findOne({
      _id: req.usuarioId,
      estado: 'activo'
    });

    if (!usuario) {
      return res.status(403).json({ 
        success: false,
        message: 'Usuario no encontrado o inactivo' 
      });
    }

    // Adjuntar el usuario completo al request
    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error al verificar usuario activo:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al verificar el estado del usuario' 
    });
  }
};

/**
 * Middleware para verificar si el usuario pertenece a la sucursal
 * o si es administrador (que puede acceder a todas las sucursales)
 */
const verificarAccesoSucursal = (req, res, next) => {
  // Si el parámetro sucursalId existe en la ruta
  if (req.params.id && req.rol !== 'administrador') {
    // Verificar si el usuario pertenece a esa sucursal
    if (req.sucursalId != req.params.id) {
      return res.status(403).json({ 
        success: false,
        message: 'No tiene acceso a esta sucursal' 
      });
    }
  }
  
  next();
};

module.exports = {
  verificarToken,
  verificarRol,
  verificarUsuarioActivo,
  verificarAccesoSucursal
};