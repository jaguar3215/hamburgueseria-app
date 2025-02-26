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
      let token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await api.get('/auth/verify');
          if (response.data.success) {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);
  
  // Función para iniciar sesión
  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      const decodedUser = jwtDecode(response.data.token);
      localStorage.setItem('user', JSON.stringify(decodedUser));
      setUser(decodedUser);
      return true;
    }
    
    return false;
  };
  
  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};