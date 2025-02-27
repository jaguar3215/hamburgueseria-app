import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const MainLayout = ({ children }) => {
 const { user, logout } = useContext(AuthContext);
 const navigate = useNavigate();
 const location = useLocation();

 const handleLogout = () => {
   logout();
   navigate('/login');
 };

 const isActive = (path) => {
   return location.pathname === path ? 'active' : '';
 };

 return (
   <div className="d-flex flex-column min-vh-100">
     <header>
       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
         <div className="container">
           <Link className="navbar-brand" to="/">JQ Q Berraquera</Link>
           
           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
             <span className="navbar-toggler-icon"></span>
           </button>
           
           <div className="collapse navbar-collapse" id="navbarNav">
             <ul className="navbar-nav me-auto">
               {user?.rol === 'administrador' && (
                 <>
                   <li className="nav-item">
                     <Link className={`nav-link ${isActive('/admin/dashboard')}`} to="/admin/dashboard">Dashboard</Link>
                   </li>
                   <li className="nav-item">
                     <Link className={`nav-link ${isActive('/admin/sucursales')}`} to="/admin/sucursales">Sucursales</Link>
                   </li>
                   <li className="nav-item">
                     <Link className={`nav-link ${isActive('/admin/usuarios')}`} to="/admin/usuarios">Usuarios</Link>
                   </li>
                   <li className="nav-item">
                     <Link className={`nav-link ${isActive('/admin/productos')}`} to="/admin/productos">Productos</Link>
                   </li>
                   <li className="nav-item">
                     <Link className={`nav-link ${isActive('/admin/categorias')}`} to="/admin/categorias">Categorías</Link>
                   </li>
                   <li className="nav-item">
                     <Link className={`nav-link ${isActive('/admin/ingredientes')}`} to="/admin/ingredientes">Ingredientes</Link>
                   </li>
                   <li className="nav-item">
                     <Link className={`nav-link ${isActive('/admin/reportes')}`} to="/admin/reportes">Reportes</Link>
                   </li>
                 </>
               )}
               
               {/* Agregar los menús para cajero y cocinero según corresponda */}
             </ul>
             
             {user && (
               <div className="d-flex">
                 <span className="navbar-text me-3">
                   {user.nombre} | {user.sucursal?.nombre || 'Sin sucursal'}
                 </span>
                 <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                   Cerrar Sesión
                 </button>
               </div>
             )}
           </div>
         </div>
       </nav>
     </header>
     
     <main className="flex-grow-1">
       <div className="container py-4">
         {children}
       </div>
     </main>
     
     <footer className="bg-light py-3 mt-auto">
       <div className="container text-center">
         <span className="text-muted">
           Sistema de Gestión JQ Q Berraquera &copy; 2025
         </span>
       </div>
     </footer>
   </div>
 );
};

export default MainLayout;