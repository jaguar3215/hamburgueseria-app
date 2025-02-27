import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import sucursalService from '../../../services/sucursalService';
import axios from 'axios';

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

const EditarSucursal = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    estado: 'activa',
    administrador_principal: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar datos de la sucursal y los usuarios administradores
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true);
        
        // Obtener el token de autenticación
        const token = localStorage.getItem('token');
        
        // Cargar la sucursal
        const sucursal = await sucursalService.obtenerPorId(id);
        
        // Cargar usuarios con rol administrador
        const respuestaUsuarios = await axios.get('http://localhost:3001/api/usuarios', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            rol: 'administrador',
            estado: 'activo'
          }
        });
        
        // Verificar si la respuesta tiene el formato esperado
        const usuariosData = respuestaUsuarios.data.data || [];
        
        setUsuarios(usuariosData);
        
        // Preparar los datos del formulario
        setFormData({
          nombre: sucursal.nombre || '',
          direccion: sucursal.direccion || '',
          telefono: sucursal.telefono || '',
          estado: sucursal.estado || 'activa',
          // Manejar diferentes formatos posibles del administrador_principal
          administrador_principal: 
            (sucursal.administrador_principal && sucursal.administrador_principal._id) || 
            sucursal.administrador_principal || 
            ''
        });
        
        setLoadingData(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos. ' + (err.response?.data?.message || err.message));
        setLoadingData(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Crear una copia de los datos para enviar
      const datosPorEnviar = {...formData};
      
      // Si el administrador_principal está vacío, enviar null
      if (!datosPorEnviar.administrador_principal) {
        datosPorEnviar.administrador_principal = null;
      }
      
      // Actualizar sucursal usando el servicio
      await sucursalService.actualizar(id, datosPorEnviar);
      
      // Redirigir a la lista de sucursales
      navigate('/admin/sucursales');
    } catch (err) {
      console.error('Error al actualizar sucursal:', err);
      setError(err.response?.data?.message || 'Error al actualizar sucursal');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando datos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <NavBar />
      
      <div className="container-fluid px-4 py-4">
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h1 className="h3 mb-1">Editar Sucursal</h1>
                <p className="text-muted">Actualiza la información de la sucursal</p>
              </div>
              
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger mb-3">
                      {error}
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
                  
                  <div className="mb-3">
                    <label htmlFor="administrador_principal" className="form-label">Administrador Principal</label>
                    <select
                      className="form-select"
                      id="administrador_principal"
                      name="administrador_principal"
                      value={formData.administrador_principal}
                      onChange={handleChange}
                    >
                      <option value="">Sin administrador asignado</option>
                      {usuarios.map(usuario => (
                        <option key={usuario._id} value={usuario._id}>
                          {usuario.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Actualizando...' : 'Actualizar Sucursal'}
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

            <footer className="text-center text-muted mt-4">
              Sistema de Gestión JQ Q Berraquera © 2025
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarSucursal;