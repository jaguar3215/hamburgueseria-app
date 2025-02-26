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
          // Configurar el token para las peticiones
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await api.get('/auth/verify');
          
          if (response.data.success) {
            // Decodificar el token y guardar usuario
            const userData = jwtDecode(token);
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          // No eliminar token en errores 500
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            setUser(null);
          }
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
      
      if (response.data && response.data.success) {
        const { token } = response.data.data;
        localStorage.setItem('token', token);
        
        // Configurar token para futuras peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Decodificar y guardar información del usuario
        const userData = jwtDecode(token);
        setUser(userData);
        
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
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};