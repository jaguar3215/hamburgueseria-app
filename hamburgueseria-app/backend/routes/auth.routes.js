// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');

/**
 * Rutas para la autenticación de usuarios
 */

// Ruta para iniciar sesión
router.post('/login', AuthController.login);

// Ruta para verificar token de autenticación
router.get('/verify', verificarToken, AuthController.verificarToken);

module.exports = router;