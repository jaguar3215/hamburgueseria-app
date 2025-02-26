import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/css/styles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas para administrador */}
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute roles={['administrador']}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Redirigir al login o a la ruta por defecto según rol */}
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
          
          {/* Ruta para cualquier otra dirección no definida */}
          <Route 
            path="*" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;