import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (roles.length > 0 && !roles.includes(user.rol)) {
    // Redirigir según el rol si no tiene permiso
    if (user.rol === 'administrador') return <Navigate to="/admin/dashboard" />;
    if (user.rol === 'cajero') return <Navigate to="/cajero/ventas" />;
    if (user.rol === 'cocinero') return <Navigate to="/cocinero/pedidos" />;
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default PrivateRoute;