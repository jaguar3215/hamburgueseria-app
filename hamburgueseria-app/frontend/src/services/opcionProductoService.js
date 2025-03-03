import api from './api';

const opcionProductoService = {
  // Obtener todas las opciones de producto
  obtenerTodas: async () => {
    const response = await api.get('/opciones-producto');
    return response.data;
  },

  // Obtener opciones de un producto específico
  obtenerPorProducto: async (productoId) => {
    const response = await api.get(`/opciones-producto/producto/${productoId}`);
    return response.data;
  },

  // Obtener una opción de producto por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/opciones-producto/${id}`);
    return response.data;
  },

  // Crear nueva opción de producto
  crear: async (datosOpcion) => {
    const response = await api.post('/opciones-producto', datosOpcion);
    return response.data;
  },

  // Actualizar opción de producto existente
  actualizar: async (id, datosOpcion) => {
    const response = await api.put(`/opciones-producto/${id}`, datosOpcion);
    return response.data;
  },

  // Eliminar opción de producto
  eliminar: async (id) => {
    const response = await api.delete(`/opciones-producto/${id}`);
    return response.data;
  }
};

export default opcionProductoService;