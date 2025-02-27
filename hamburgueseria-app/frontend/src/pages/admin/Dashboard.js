import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';

// Iconos para los círculos (puedes reemplazarlos con tus propios SVGs)
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const StoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
    <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
  </svg>
);

const ProductIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
    <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
  </svg>
);

const IngredientIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
  </svg>
);

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">JQ Q Berraquera</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {[
              {label: 'Dashboard', to: '/admin/dashboard', active: true},
              {label: 'Sucursales', to: '/admin/sucursales'},
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

const Dashboard = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    sucursalesActivas: 0,
    totalSucursales: 0,
    sucursales: [],
    productos: 0,
    ingredientes: 0,
    ingredientesBajoStock: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.obtenerEstadisticas();
        setStats({
          usuarios: data.usuarios.length,
          sucursalesActivas: data.sucursalesActivas,
          totalSucursales: data.totalSucursales,
          sucursales: data.sucursales,
          productos: data.productos.length,
          ingredientes: data.ingredientes.length,
          ingredientesBajoStock: data.ingredientesBajoStock
        });
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar dashboard:', err);
        setError('Error al cargar estadísticas del dashboard');
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando datos...</span>
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

  // Determinar el nivel de stock para cada ingrediente
  const determinarNivelStock = (ingrediente) => {
    const ratio = ingrediente.stock / ingrediente.stock_minimo;
    
    if (ratio <= 1) return { nivel: 'bajo', clase: 'danger', texto: 'Stock bajo' };
    if (ratio <= 1.5) return { nivel: 'medio', clase: 'warning', texto: 'Stock medio' };
    return { nivel: 'optimo', clase: 'success', texto: 'Stock óptimo' };
  };

  return (
    <div>
      <NavBar />
      
      <div className="container-fluid px-4 py-4">
        <h1 className="mb-4">Dashboard de Administración</h1>
        
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '64px', height: '64px', backgroundColor: '#3498db'}}>
                    <UserIcon />
                  </div>
                </div>
                <h2 className="display-4">{stats.usuarios}</h2>
                <p className="text-muted mb-0">Usuarios Registrados</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '64px', height: '64px', backgroundColor: '#27ae60'}}>
                    <StoreIcon />
                  </div>
                </div>
                <h2 className="display-4">{stats.sucursalesActivas}</h2>
                <p className="text-muted mb-0">Sucursales Activas</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '64px', height: '64px', backgroundColor: '#00bcd4'}}>
                    <ProductIcon />
                  </div>
                </div>
                <h2 className="display-4">{stats.productos}</h2>
                <p className="text-muted mb-0">Productos</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '64px', height: '64px', backgroundColor: '#f1c40f'}}>
                    <IngredientIcon />
                  </div>
                </div>
                <h2 className="display-4">{stats.ingredientes}</h2>
                <p className="text-muted mb-0">Ingredientes</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">Alertas de Inventario</h5>
              </div>
              <div className="card-body p-0">
                {stats.ingredientesBajoStock.length === 0 ? (
                  <p className="text-success p-3 mb-0">No hay ingredientes con stock bajo</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {stats.ingredientesBajoStock.map(ing => {
                      const stockInfo = determinarNivelStock(ing);
                      return (
                        <div key={ing._id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>{ing.nombre}</div>
                          <span className={`badge bg-${stockInfo.clase}`}>
                            {stockInfo.texto}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">Sucursales</h5>
              </div>
              <div className="card-body p-0">
                {stats.sucursales.length === 0 ? (
                  <p className="text-muted p-3 mb-0">No hay sucursales registradas</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {stats.sucursales.map(sucursal => (
                      <div key={sucursal._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>{sucursal.nombre}</div>
                        <span className={`badge ${sucursal.estado === 'activa' ? 'bg-success' : 'bg-danger'}`}>
                          {sucursal.estado === 'activa' ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;