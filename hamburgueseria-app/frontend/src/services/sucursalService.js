import axios from 'axios';

const API_URL = 'http://localhost:3001/api/sucursales';

const sucursalService = {
  // Obtener todas las sucursales
  obtenerTodas: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      throw error;
    }
  },

  // Crear nueva sucursal
  crear: async (sucursal) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, sucursal, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear sucursal:', error);
      throw error;
    }
  },

  // Obtener sucursal por ID
  obtenerPorId: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener sucursal:', error);
      throw error;
    }
  },

  // Actualizar sucursal
  actualizar: async (id, sucursal) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${id}`, sucursal, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar sucursal:', error);
      throw error;
    }
  },

  // Eliminar sucursal
  eliminar: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar sucursal:', error);
      throw error;
    }
  }
};

export default sucursalService;