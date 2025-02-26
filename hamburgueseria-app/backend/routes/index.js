// routes/index.js
const express = require('express');
const router = express.Router();

// Importar rutas de cada controlador
const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const sucursalRoutes = require('./sucursal.routes');
const categoriaRoutes = require('./categoria.routes');
const ingredienteRoutes = require('./ingrediente.routes');
const productoRoutes = require('./producto.routes');
const opcionProductoRoutes = require('./opcion-producto.routes');

/**
 * Configuración de rutas principales de la API
 */

// Ruta de estado del API (pública)
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    version: '0.2',
    timestamp: new Date()
  });
});

// Asignar rutas específicas
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/sucursales', sucursalRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/ingredientes', ingredienteRoutes);
router.use('/productos', productoRoutes);
router.use('/opciones-producto', opcionProductoRoutes);

module.exports = router;