import api from './api';

const usuarioService = {
  // Obtener todos los usuarios con filtros opcionales
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const url = `/usuarios${params.toString() ? '?' + params.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un usuario por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear nuevo usuario
  crear: async (datosUsuario) => {
    const response = await api.post('/usuarios', datosUsuario);
    return response.data;
  },

  // Actualizar usuario existente
  actualizar: async (id, datosUsuario) => {
    const response = await api.put(`/usuarios/${id}`, datosUsuario);
    return response.data;
  },

  // Desactivar usuario (no elimina, solo cambia estado)
  desactivar: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
  
  // Verificar código de autorización para operaciones sensibles
  verificarCodigo: async (codigo) => {
    const response = await api.post('/usuarios/autorizar', { codigo });
    return response.data;
  },
  
  // Obtener roles disponibles
  obtenerRoles: () => {
    return [
      { valor: 'administrador', etiqueta: 'Administrador' },
      { valor: 'cajero', etiqueta: 'Cajero' },
      { valor: 'cocinero', etiqueta: 'Cocinero' }
    ];
  }
};

export default usuarioService;