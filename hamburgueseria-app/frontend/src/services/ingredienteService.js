import api from './api';

const ingredienteService = {
  // Obtener todos los ingredientes
  obtenerTodos: async () => {
    const response = await api.get('/ingredientes');
    return response.data;
  },

  // Obtener un ingrediente por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/ingredientes/${id}`);
    return response.data;
  },

  // Crear nuevo ingrediente
  crear: async (datosIngrediente) => {
    const response = await api.post('/ingredientes', datosIngrediente);
    return response.data;
  },

  // Actualizar ingrediente existente
  actualizar: async (id, datosIngrediente) => {
    const response = await api.put(`/ingredientes/${id}`, datosIngrediente);
    return response.data;
  },

  // Eliminar ingrediente
  eliminar: async (id) => {
    const response = await api.delete(`/ingredientes/${id}`);
    return response.data;
  },

  // Actualizar stock de un ingrediente
  actualizarStock: async (id, nuevoStock) => {
    const response = await api.post(`/ingredientes/${id}/stock`, { stock: nuevoStock });
    return response.data;
  },

  // Obtener unidades de medida disponibles
  obtenerUnidadesMedida: () => {
    return [
      { valor: 'gramos', etiqueta: 'Gramos' },
      { valor: 'unidades', etiqueta: 'Unidades' },
      { valor: 'láminas', etiqueta: 'Láminas' },
      { valor: 'mililitros', etiqueta: 'Mililitros' },
      { valor: 'porciones', etiqueta: 'Porciones' }
    ];
  }
};

export default ingredienteService;