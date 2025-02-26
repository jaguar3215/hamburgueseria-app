// routes/sucursal.routes.js
const express = require('express');
const router = express.Router();
const SucursalController = require('../controllers/sucursal.controller');
const { 
  verificarToken, 
  verificarRol, 
  verificarUsuarioActivo 
} = require('../middleware/auth.middleware');

/**
 * Rutas para la gestión de sucursales
 * La mayoría de operaciones requieren rol de administrador
 */

// Middleware aplicado a todas las rutas de sucursales
router.use(verificarToken);
router.use(verificarUsuarioActivo);

// Obtener todas las sucursales (cualquier usuario autenticado)
router.get('/', SucursalController.obtenerTodas);

// Obtener una sucursal específica por ID
router.get('/:id', SucursalController.obtenerPorId);

// Crear una nueva sucursal (solo administradores)
router.post('/', verificarRol(['administrador']), SucursalController.crear);

// Actualizar una sucursal (solo administradores)
router.put('/:id', verificarRol(['administrador']), SucursalController.actualizar);

// Desactivar una sucursal (solo administradores)
router.delete('/:id', verificarRol(['administrador']), SucursalController.desactivar);

module.exports = router;