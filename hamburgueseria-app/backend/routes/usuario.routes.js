// routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const { 
  verificarToken, 
  verificarRol, 
  verificarUsuarioActivo 
} = require('../middleware/auth.middleware');

/**
 * Rutas para la gestión de usuarios
 * Todas las rutas requieren autenticación
 */

// Middleware aplicado a todas las rutas de usuarios
router.use(verificarToken);
router.use(verificarUsuarioActivo);

// Obtener todos los usuarios (solo admins pueden ver todos, otros ven solo su sucursal)
router.get('/', UsuarioController.obtenerTodos);

// Obtener un usuario específico por ID
router.get('/:id', UsuarioController.obtenerPorId);

// Crear un nuevo usuario (solo administradores)
router.post('/', verificarRol(['administrador']), UsuarioController.crear);

// Actualizar un usuario (admins pueden actualizar cualquiera, otros solo su perfil)
router.put('/:id', UsuarioController.actualizar);

// Eliminar un usuario (solo administradores)
router.delete('/:id', verificarRol(['administrador']), UsuarioController.eliminar);

// Autorizar acción especial mediante código
router.post('/autorizar', UsuarioController.autorizar);

module.exports = router;