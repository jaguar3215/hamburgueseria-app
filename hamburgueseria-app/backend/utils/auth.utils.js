// utils/auth.utils.js
const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT con la información del usuario
 * @param {Object} payload - Datos del usuario para incluir en el token
 * @returns {String} Token JWT
 */
const generarToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'secreto_temporal_para_desarrollo';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifica la validez de un token JWT
 * @param {String} token - Token JWT a verificar
 * @returns {Object|null} Payload decodificado o null si es inválido
 */
const verificarToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET || 'secreto_temporal_para_desarrollo';
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return null;
  }
};

module.exports = {
  generarToken,
  verificarToken
};