// routes/categoria.routes.js
const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoria.controller');
const { 
  verificarToken, 
  verificarRol, 
  verificarUsuarioActivo 
} = require('../middleware/auth.middleware');

/**
 * Rutas para la gestión de categorías de productos
 */

// Middleware aplicado a todas las rutas de categorías
router.use(verificarToken);
router.use(verificarUsuarioActivo);

// Obtener todas las categorías (cualquier usuario autenticado)
router.get('/', CategoriaController.obtenerTodas);

// Obtener una categoría específica por ID
router.get('/:id', CategoriaController.obtenerPorId);

// Crear una nueva categoría (solo administradores)
router.post('/', verificarRol(['administrador']), CategoriaController.crear);

// Actualizar una categoría (solo administradores)
router.put('/:id', verificarRol(['administrador']), CategoriaController.actualizar);

// Eliminar una categoría (solo administradores)
router.delete('/:id', verificarRol(['administrador']), CategoriaController.eliminar);

module.exports = router;