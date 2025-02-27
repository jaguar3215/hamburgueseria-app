import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sucursalService from '../../../services/sucursalService';

// Componente de Modal para código de autorización
const AutorizacionModal = ({ show, onClose, onConfirm }) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Verificar el código (aquí podrías validarlo contra el backend)
    if (codigo === 'SUCURSAL2025') { // Este código debería estar en el backend
      onConfirm();
    } else {
      setError('Código de autorización incorrecto');
    }
  };
  
  if (!show) return null;
  
  return (
    <div className="modal d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Autorización requerida</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p>Para crear una nueva sucursal, ingrese el código de autorización:</p>
              <div className="mb-3">
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Código de autorización"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Verificar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

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

const NuevaSucursal = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    estado: 'activa'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAutorizacion, setShowAutorizacion] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError(''); // Limpiar el error cuando el usuario escribe
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que los campos requeridos estén completos
    if (!formData.nombre || !formData.direccion || !formData.telefono) {
      setFormError('Nombre, dirección y teléfono son requeridos');
      return;
    }
    
    // Mostrar modal de autorización
    setShowAutorizacion(true);
  };
  
  const crearSucursal = async () => {
    setShowAutorizacion(false);
    setLoading(true);
    setError(null);

    try {
      // Usar el servicio para crear la sucursal
      await sucursalService.crear(formData);
      
      // Redirigir a la lista de sucursales tras éxito
      navigate('/admin/sucursales');
    } catch (err) {
      console.error('Error al crear sucursal:', err);
      setError(err.response?.data?.message || 'Error al crear sucursal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <NavBar />
      
      <div className="container-fluid px-4 py-4">
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h1 className="h3 mb-1">Nueva Sucursal</h1>
                <p className="text-muted">Registra una nueva sucursal para tu negocio</p>
              </div>
              
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger mb-3">
                      {error}
                    </div>
                  )}
                  
                  {formError && (
                    <div className="alert alert-danger mb-3">
                      {formError}
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre de Sucursal</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Sucursal Norte"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Calle 123 #45-67"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      placeholder="Ej. 300 123 4567"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select
                      className="form-select"
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                    >
                      <option value="activa">Activa</option>
                      <option value="inactiva">Inactiva</option>
                    </select>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Creando Sucursal...' : 'Crear Sucursal'}
                    </button>
                    <Link 
                      to="/admin/sucursales" 
                      className="btn btn-outline-secondary"
                    >
                      Cancelar
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de autorización */}
      <AutorizacionModal 
        show={showAutorizacion} 
        onClose={() => setShowAutorizacion(false)}
        onConfirm={crearSucursal}
      />
    </div>
  );
};

export default NuevaSucursal;