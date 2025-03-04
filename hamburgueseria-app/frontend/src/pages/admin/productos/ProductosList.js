// src/pages/admin/productos/ProductosList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListLayout from '../../../components/layout/ListLayout';
import productoService from '../../../services/productoService';
import categoriaService from '../../../services/categoriaService';

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: '',
    disponible: '',
    buscar: ''
  });

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener categorías para el filtro
        const respCategorias = await categoriaService.obtenerTodas();
        setCategorias(respCategorias.data);
        
        // Obtener productos desde la API
        // Si disponible es una cadena vacía, no la incluimos en los filtros
        const filtrosAplicados = {...filtros};
        if (filtrosAplicados.disponible === '') {
          delete filtrosAplicados.disponible;
        }
        if (filtrosAplicados.categoria === '') {
          delete filtrosAplicados.categoria;
        }
        
        // Búsqueda por nombre se maneja aparte
        const buscar = filtrosAplicados.buscar;
        delete filtrosAplicados.buscar;
        
        const respProductos = await productoService.obtenerTodos(filtrosAplicados);
        let productosData = respProductos.data;
        
        // Filtramos por nombre en el cliente si hay un término de búsqueda
        if (buscar && buscar.trim() !== '') {
          const busqueda = buscar.trim().toLowerCase();
          productosData = productosData.filter(producto => 
            producto.nombre.toLowerCase().includes(busqueda)
          );
        }
        
        setProductos(productosData);
        setError(null);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los productos. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [filtros]);

  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambio de disponibilidad
  const handleCambiarDisponibilidad = async (id, disponibleActual) => {
    try {
      await productoService.cambiarDisponibilidad(id, !disponibleActual);
      
      // Actualizar la lista de productos
      setProductos(productos.map(producto => 
        producto._id === id 
          ? { ...producto, disponible: !disponibleActual } 
          : producto
      ));
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
      alert('Error al cambiar la disponibilidad del producto');
    }
  };

  // Manejar eliminación de producto
  const handleEliminarProducto = async (id, nombre) => {
    const confirmar = window.confirm(`¿Está seguro de eliminar el producto "${nombre}"?`);
    
    if (confirmar) {
      try {
        await productoService.eliminar(id);
        
        // Actualizar la lista eliminando el producto
        setProductos(productos.filter(producto => producto._id !== id));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  return (
    <ListLayout title="Productos" entity="Producto">
      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Filtros</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Categoría</label>
              <select 
                className="form-select"
                name="categoria"
                value={filtros.categoria}
                onChange={handleFiltroChange}
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Disponibilidad</label>
              <select 
                className="form-select"
                name="disponible"
                value={filtros.disponible}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="true">Disponibles</option>
                <option value="false">No disponibles</option>
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Buscar</label>
              <input 
                type="text"
                className="form-control"
                placeholder="Nombre del producto"
                name="buscar"
                value={filtros.buscar}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mensajes de error o carga */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
      
      {/* Tabla de productos */}
      {!loading && productos.length === 0 ? (
        <div className="alert alert-info">
          No se encontraron productos. Intente cambiar los filtros o cree un nuevo producto.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio Base</th>
                <th>Disponibilidad</th>
                <th>Para Llevar</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto._id}>
                  <td>
                    {producto.imagen ? (
                      <img 
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={{width: '50px', height: '50px', objectFit: 'cover'}}
                        className="img-thumbnail"
                      />
                    ) : (
                      <div 
                        className="bg-light d-flex align-items-center justify-content-center" 
                        style={{width: '50px', height: '50px'}}
                      >
                        <span className="text-muted">N/A</span>
                      </div>
                    )}
                  </td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria?.nombre || 'Sin categoría'}</td>
                  <td>${producto.precio_base.toLocaleString()}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={producto.disponible}
                        onChange={() => handleCambiarDisponibilidad(producto._id, producto.disponible)}
                      />
                      <label className="form-check-label">
                        {producto.disponible ? 'Disponible' : 'No disponible'}
                      </label>
                    </div>
                  </td>
                  <td>
                    {producto.para_llevar === 'sí' && 'Solo para llevar'}
                    {producto.para_llevar === 'no' && 'Solo en local'}
                    {producto.para_llevar === 'ambos' && 'Ambas opciones'}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link
                        to={`/admin/productos/editar/${producto._id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Editar producto"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/admin/productos/${producto._id}/opciones`}
                        className="btn btn-sm btn-outline-secondary"
                        title="Gestionar ingredientes"
                      >
                        Opciones
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminarProducto(producto._id, producto.nombre)}
                        title="Eliminar producto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ListLayout>
  );
};

export default ProductosList;