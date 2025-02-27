import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import api from '../../../services/api';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    rol: '',
    sucursal: '',
    estado: '',
    buscar: ''
  });
  const [sucursales, setSucursales] = useState([]);

  // Cargar usuarios con filtros aplicados
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      
      // Construir query params para filtros
      const params = new URLSearchParams();
      if (filtros.rol) params.append('rol', filtros.rol);
      if (filtros.sucursal) params.append('sucursal', filtros.sucursal);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.buscar) params.append('buscar', filtros.buscar);
      
      const url = `/usuarios${params.toString() ? '?' + params.toString() : ''}`;
      console.log('URL de consulta:', url); // Para depuración
      
      const response = await api.get(url);
      console.log('Respuesta del servidor:', response.data); // Para depuración
      
      setUsuarios(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar usuarios. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios y sucursales al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Cargar sucursales para el filtro
        const resSucursales = await api.get('/sucursales');
        setSucursales(resSucursales.data.data);
        
        // Cargar usuarios con filtros iniciales
        await cargarUsuarios();
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar la información. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Manejar cambios en filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    console.log(`Filtro ${name} actualizado a:`, value);
  };

  // Aplicar filtros
  const aplicarFiltros = (e) => {
    e.preventDefault();
    console.log('Aplicando filtros:', filtros);
    cargarUsuarios();
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    console.log('Limpiando filtros');
    setFiltros({
      rol: '',
      sucursal: '',
      estado: '',
      buscar: ''
    });
    // Usamos setTimeout para asegurarnos de que el estado se actualice antes de cargar
    setTimeout(cargarUsuarios, 10);
  };

  // Manejar desactivación de usuario
  const handleDesactivarUsuario = async (id) => {
    if (window.confirm('¿Está seguro que desea desactivar este usuario?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        // Actualizar lista después de desactivar
        setUsuarios(usuarios.map(usuario => 
          usuario._id === id ? { ...usuario, estado: 'inactivo' } : usuario
        ));
      } catch (err) {
        console.error('Error al desactivar usuario:', err);
        alert('Error al desactivar usuario. Intente nuevamente.');
      }
    }
  };

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle me-2" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Nuevo Usuario
        </Link>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Filtros</h5>
        </div>
        <div className="card-body">
          <form onSubmit={aplicarFiltros}>
            <div className="row g-3">
              <div className="col-md-3">
                <label htmlFor="rol" className="form-label">Rol</label>
                <select 
                  id="rol" 
                  name="rol" 
                  className="form-select"
                  value={filtros.rol}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todos</option>
                  <option value="administrador">Administrador</option>
                  <option value="cajero">Cajero</option>
                  <option value="cocinero">Cocinero</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <label htmlFor="sucursal" className="form-label">Sucursal</label>
                <select 
                  id="sucursal" 
                  name="sucursal" 
                  className="form-select"
                  value={filtros.sucursal}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todas</option>
                  {sucursales.map(sucursal => (
                    <option key={sucursal._id} value={sucursal._id}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-3">
                <label htmlFor="estado" className="form-label">Estado</label>
                <select 
                  id="estado" 
                  name="estado" 
                  className="form-select"
                  value={filtros.estado}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <label htmlFor="buscar" className="form-label">Buscar</label>
                <input 
                  type="text" 
                  id="buscar" 
                  name="buscar" 
                  className="form-control"
                  placeholder="Nombre o usuario" 
                  value={filtros.buscar}
                  onChange={handleFiltroChange}
                />
              </div>
              
              <div className="col-12 d-flex justify-content-end">
                <button type="button" onClick={limpiarFiltros} className="btn btn-secondary me-2">
                  Limpiar
                </button>
                <button type="submit" className="btn btn-primary">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Mensajes de error o carga */}
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
      
      {error && !loading && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Tabla de usuarios */}
      {!loading && !error && (
        <>
          {usuarios.length === 0 ? (
            <div className="alert alert-info">No se encontraron usuarios con los filtros aplicados.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Sucursal</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario._id}>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.usuario}</td>
                      <td>
                        <span className={`badge bg-${
                          usuario.rol === 'administrador' ? 'danger' : 
                          usuario.rol === 'cajero' ? 'success' : 'info'
                        }`}>
                          {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                        </span>
                      </td>
                      <td>{usuario.sucursal?.nombre || 'Sin sucursal'}</td>
                      <td>
                        <span className={`badge bg-${usuario.estado === 'activo' ? 'success' : 'secondary'}`}>
                          {usuario.estado}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link 
                            to={`/admin/usuarios/editar/${usuario._id}`} 
                            className="btn btn-outline-primary me-1"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                            </svg>
                          </Link>
                          {usuario.estado === 'activo' && (
                            <button 
                              onClick={() => handleDesactivarUsuario(usuario._id)}
                              className="btn btn-outline-danger"
                              title="Desactivar"
                              disabled={usuario.usuario === 'admin'} // Proteger usuario admin
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-x" viewBox="0 0 16 16">
                                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1zm5.146-7.54a.5.5 0 0 0-.708.708L13.793 8l-1.146 1.146a.5.5 0 0 0 .708.708L14.5 8.707l1.146 1.147a.5.5 0 0 0 .708-.708L15.207 8l1.147-1.146a.5.5 0 0 0-.707-.708L14.5 7.293z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default UsuariosList;