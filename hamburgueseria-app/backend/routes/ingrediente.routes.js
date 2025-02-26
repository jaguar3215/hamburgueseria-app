// routes/ingrediente.routes.js
const express = require('express');
const router = express.Router();
const IngredienteController = require('../controllers/ingrediente.controller');
const { 
  verificarToken, 
  verificarRol, 
  verificarUsuarioActivo 
} = require('../middleware/auth.middleware');

/**
 * Rutas para la gestión de ingredientes
 */

// Middleware aplicado a todas las rutas de ingredientes
router.use(verificarToken);
router.use(verificarUsuarioActivo);

// Obtener todos los ingredientes
router.get('/', IngredienteController.obtenerTodos);

// Obtener un ingrediente específico por ID
router.get('/:id', IngredienteController.obtenerPorId);

// Crear un nuevo ingrediente (administrador)
router.post('/', verificarRol(['administrador']), IngredienteController.crear);

// Actualizar un ingrediente (administrador)
router.put('/:id', verificarRol(['administrador']), IngredienteController.actualizar);

// Eliminar un ingrediente (administrador)
router.delete('/:id', verificarRol(['administrador']), IngredienteController.eliminar);

// Actualizar stock de un ingrediente (administrador o cocinero)
router.post('/:id/stock', verificarRol(['administrador', 'cocinero']), IngredienteController.actualizarStock);

module.exports = router;