// routes/opcion-producto.routes.js
const express = require('express');
const router = express.Router();
const OpcionProductoController = require('../controllers/opcion-producto.controller');
const { 
  verificarToken, 
  verificarRol, 
  verificarUsuarioActivo 
} = require('../middleware/auth.middleware');

/**
 * Rutas para la gestión de opciones de producto
 */

// Middleware aplicado a todas las rutas de opciones de producto
router.use(verificarToken);
router.use(verificarUsuarioActivo);

// Obtener todas las opciones de producto
router.get('/', OpcionProductoController.obtenerTodas);

// Obtener todas las opciones de un producto específico
router.get('/producto/:productoId', OpcionProductoController.obtenerPorProducto);

// Obtener una opción de producto específica por ID
router.get('/:id', OpcionProductoController.obtenerPorId);

// Crear una nueva opción de producto (solo administradores)
router.post('/', verificarRol(['administrador']), OpcionProductoController.crear);

// Actualizar una opción de producto (solo administradores)
router.put('/:id', verificarRol(['administrador']), OpcionProductoController.actualizar);

// Eliminar una opción de producto (solo administradores)
router.delete('/:id', verificarRol(['administrador']), OpcionProductoController.eliminar);

module.exports = router;