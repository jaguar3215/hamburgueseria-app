import api from './api';

const productoService = {
  // Obtener todos los productos con filtros opcionales
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value);
    });
    
    const url = `/productos${params.toString() ? '?' + params.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener productos por categoría
  obtenerPorCategoria: async (categoriaId, disponible) => {
    let url = `/productos/categoria/${categoriaId}`;
    if (disponible !== undefined) {
      url += `?disponible=${disponible}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un producto por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  // Crear nuevo producto
  crear: async (datosProducto) => {
    const response = await api.post('/productos', datosProducto);
    return response.data;
  },

  // Actualizar producto existente
  actualizar: async (id, datosProducto) => {
    const response = await api.put(`/productos/${id}`, datosProducto);
    return response.data;
  },

  // Eliminar producto
  eliminar: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },

  // Cambiar disponibilidad de un producto
  cambiarDisponibilidad: async (id, disponible) => {
    const response = await api.patch(`/productos/${id}/disponibilidad`, { disponible });
    return response.data;
  },

  // Actualizar opciones de un producto
  actualizarOpciones: async (id, opciones) => {
    const response = await api.put(`/productos/${id}/opciones`, { opciones });
    return response.data;
  },

  // Obtener opciones para "para_llevar"
  obtenerOpcionesParaLlevar: () => {
    return [
      { valor: 'sí', etiqueta: 'Sólo para llevar' },
      { valor: 'no', etiqueta: 'Sólo en local' },
      { valor: 'ambos', etiqueta: 'Ambas opciones' }
    ];
  }
};

export default productoService;