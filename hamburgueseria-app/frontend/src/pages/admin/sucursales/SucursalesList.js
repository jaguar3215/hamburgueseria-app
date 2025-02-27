import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sucursalService from '../../../services/sucursalService';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">JQ Q Berraquera</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {[
              {label: 'Dashboard', to: '/admin/dashboard'},
              {label: 'Sucursales', to: '/admin/sucursales', active: true},
              {label: 'Usuarios', to: '/admin/usuarios'},
              {label: 'Productos', to: '/admin/productos'},
              {label: 'Categorías', to: '/admin/categorias'},
              {label: 'Ingredientes', to: '/admin/ingredientes'},
              {label: 'Reportes', to: '/admin/reportes'}
            ].map((item) => (
              <li key={item.label} className="nav-item">
                <Link 
                  className={`nav-link ${item.active ? 'active' : ''}`} 
                  to={item.to}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3 text-white">
              Administrador | Sin sucursal
            </span>
            <button className="btn btn-outline-light btn-sm">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const SucursalesList = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        setLoading(true);
        const datos = await sucursalService.obtenerTodas();
        setSucursales(datos);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar sucursales:', err);
        setError('No se pudieron cargar las sucursales');
        setLoading(false);
      }
    };

    cargarSucursales();
  }, []);

  const handleEliminarSucursal = async (id) => {
    // Primero, verifica el estado actual de la sucursal
    const sucursal = sucursales.find(s => s._id === id);
    
    if (sucursal.estado === 'inactiva') {
      alert('Esta sucursal ya está desactivada');
      return;
    }
    
    const confirmacion = window.confirm('¿Estás seguro de desactivar esta sucursal?');
    if (confirmacion) {
      try {
        await sucursalService.eliminar(id);
        
        // Actualizar localmente sin necesidad de una nueva petición
        setSucursales(sucursales.map(s => 
          s._id === id ? {...s, estado: 'inactiva'} : s
        ));
        
        alert('Sucursal desactivada exitosamente');
      } catch (error) {
        console.error('Error al desactivar sucursal:', error);
        
        // Manejo específico para el error conocido
        if (error.response?.data?.message === "La sucursal ya está desactivada") {
          alert('Esta sucursal ya está desactivada');
          
          // Actualizar la interfaz para reflejar el estado correcto
          setSucursales(sucursales.map(s => 
            s._id === id ? {...s, estado: 'inactiva'} : s
          ));
        } else {
          alert('Error al desactivar la sucursal: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <NavBar />
      
      <div className="container-fluid px-4 py-4">
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h1 className="h3 mb-1">Sucursales</h1>
            <p className="text-muted">Administra y gestiona las sucursales de tu negocio</p>
          </div>
          <div className="col-auto">
            <Link 
              to="/admin/sucursales/nuevo" 
              className="btn btn-primary me-2"
            >
              + Nueva Sucursal
            </Link>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sucursales.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No hay sucursales registradas
                      </td>
                    </tr>
                  ) : (
                    sucursales.map(sucursal => (
                      <tr key={sucursal._id}>
                        <td>{sucursal.nombre}</td>
                        <td>{sucursal.direccion}</td>
                        <td>{sucursal.telefono}</td>
                        <td>
                          <span className={`badge ${sucursal.estado === 'activa' ? 'bg-success' : 'bg-danger'}`}>
                            {sucursal.estado}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group" role="group">
                            <Link 
                              to={`/admin/sucursales/editar/${sucursal._id}`} 
                              className="btn btn-sm btn-outline-primary"
                            >
                              Editar
                            </Link>
                            <button 
                              className={`btn btn-sm btn-outline-${sucursal.estado === 'activa' ? 'danger' : 'secondary'}`}
                              onClick={() => handleEliminarSucursal(sucursal._id)}
                              disabled={sucursal.estado === 'inactiva'}
                            >
                              {sucursal.estado === 'activa' ? 'Desactivar' : 'Desactivada'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-white">
            <span className="text-muted">
              Total de sucursales: {sucursales.length}
            </span>
          </div>
        </div>

        <footer className="text-center text-muted mt-4">
          Sistema de Gestión JQ Q Berraquera © 2025
        </footer>
      </div>
    </div>
  );
};

export default SucursalesList;