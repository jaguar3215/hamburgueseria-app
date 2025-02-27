import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const dashboardService = {
  // Obtener estadísticas generales
  obtenerEstadisticas: async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Realizar múltiples solicitudes en paralelo
      const [sucursalesRes, usuariosRes, productosRes, categoriasRes, ingredientesRes] = await Promise.all([
        axios.get(`${API_URL}/sucursales`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/usuarios`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/productos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/categorias`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/ingredientes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      // Procesar y devolver las estadísticas
      return {
        sucursales: sucursalesRes.data.data || [],
        usuarios: usuariosRes.data.data || [],
        productos: productosRes.data.data || [],
        categorias: categoriasRes.data.data || [],
        ingredientes: ingredientesRes.data.data || [],
        // Estadísticas derivadas
        sucursalesActivas: (sucursalesRes.data.data || []).filter(s => s.estado === 'activa').length,
        totalSucursales: (sucursalesRes.data.data || []).length,
        // Ingredientes con stock bajo
        ingredientesBajoStock: (ingredientesRes.data.data || []).filter(
          ing => ing.stock <= ing.stock_minimo
        )
      };
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  }
};

export default dashboardService;