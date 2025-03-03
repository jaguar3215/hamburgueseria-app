import api from './api';

const categoriaService = {
  // Obtener todas las categorías
  obtenerTodas: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },

  // Obtener una categoría por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  // Crear nueva categoría
  crear: async (datosCategoria) => {
    const response = await api.post('/categorias', datosCategoria);
    return response.data;
  },

  // Actualizar categoría existente
  actualizar: async (id, datosCategoria) => {
    const response = await api.put(`/categorias/${id}`, datosCategoria);
    return response.data;
  },

  // Eliminar categoría
  eliminar: async (id) => {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  }
};

export default categoriaService;