// routes/producto.routes.js
const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/producto.controller');
const { 
  verificarToken, 
  verificarRol, 
  verificarUsuarioActivo 
} = require('../middleware/auth.middleware');

/**
 * Rutas para la gestión de productos
 */

// Middleware aplicado a todas las rutas de productos
router.use(verificarToken);
router.use(verificarUsuarioActivo);

// Obtener todos los productos
router.get('/', ProductoController.obtenerTodos);

// Obtener un producto específico por ID
router.get('/:id', ProductoController.obtenerPorId);

// Crear un nuevo producto (solo administradores)
router.post('/', verificarRol(['administrador']), ProductoController.crear);

// Actualizar un producto (solo administradores)
router.put('/:id', verificarRol(['administrador']), ProductoController.actualizar);

// Eliminar un producto (solo administradores)
router.delete('/:id', verificarRol(['administrador']), ProductoController.eliminar);

// Actualizar opciones de ingredientes de un producto (solo administradores)
router.put('/:id/opciones', verificarRol(['administrador']), ProductoController.actualizarOpciones);

module.exports = router;