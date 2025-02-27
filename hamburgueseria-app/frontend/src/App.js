import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas de autenticación
import Login from './pages/auth/Login';
import Unauthorized from './pages/auth/Unauthorized';

// Páginas de administrador
import AdminDashboard from './pages/admin/Dashboard';
import UsuariosList from './pages/admin/usuarios/UsuariosList';
import NuevoUsuario from './pages/admin/usuarios/NuevoUsuario';
import EditarUsuario from './pages/admin/usuarios/EditarUsuario';
import SucursalesList from './pages/admin/sucursales/SucursalesList';
import NuevaSucursal from './pages/admin/sucursales/NuevaSucursal';
import EditarSucursal from './pages/admin/sucursales/EditarSucursal';
import ProductosList from './pages/admin/productos/ProductosList';
import CategoriasList from './pages/admin/categorias/CategoriasList';
import IngredientesList from './pages/admin/ingredientes/IngredientesList';
import ReportesList from './pages/admin/reportes/ReportesList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Rutas para administradores */}
          <Route path="/admin/*" element={<PrivateRoute allowedRoles={['administrador']} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            
            {/* Rutas de sucursales */}
            <Route path="sucursales" element={<SucursalesList />} />
            <Route path="sucursales/nuevo" element={<NuevaSucursal />} />
            <Route path="sucursales/editar/:id" element={<EditarSucursal />} />
            
            {/* Rutas de usuarios */}
            <Route path="usuarios" element={<UsuariosList />} />
            <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
            <Route path="usuarios/editar/:id" element={<EditarUsuario />} />
            
            {/* Otras rutas */}
            <Route path="productos" element={<ProductosList />} />
            <Route path="categorias" element={<CategoriasList />} />
            <Route path="ingredientes" element={<IngredientesList />} />
            <Route path="reportes" element={<ReportesList />} />
            
            {/* Redirecciones */}
            <Route path="" element={<Navigate to="dashboard" />} />
            <Route path="*" element={<Navigate to="dashboard" />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;