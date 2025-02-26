import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Verificar si hay un token al cargar
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Asegurarnos que el token se envía correctamente en cada petición
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await api.get('/auth/verify');
          
          if (response.data.success) {
            // Si la verificación del backend es exitosa, usar los datos del usuario
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
          } else {
            // Si hay respuesta pero no es exitosa, limpiar datos
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          
          // Solo limpiar en caso de error de autorización
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
          // Para otros errores (como 500), mantener el token y usuario por ahora
        }
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);
  
  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Verifica la estructura real de la respuesta de tu API
      if (response.data && response.data.success) {
        const token = response.data.data.token;
        localStorage.setItem('token', token);
        
        // Configurar el token para las siguientes peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Decodifica el token para obtener la información del usuario
        const decodedUser = jwtDecode(token);
        
        setUser(decodedUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      return false;
    }
  };
  
  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};