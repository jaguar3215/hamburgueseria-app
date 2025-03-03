import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListLayout from '../../../components/layout/ListLayout';
import categoriaService from '../../../services/categoriaService';

const CategoriasList = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Función para cargar todas las categorías
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoriaService.obtenerTodas();
      setCategorias(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError('Error al cargar las categorías. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una categoría
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer.')) {
      try {
        await categoriaService.eliminar(id);
        alert('Categoría eliminada exitosamente');
        // Recargar la lista de categorías
        cargarCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert('Error al eliminar la categoría: ' + error.response?.data?.message || error.message);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="d-flex justify-content-center"><div className="spinner-border" role="status"></div></div>;
    }

    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    if (categorias.length === 0) {
      return (
        <div className="alert alert-info">
          No hay categorías registradas. Crea una nueva categoría para comenzar.
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria._id}>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion || 'Sin descripción'}</td>
                <td>
                  <Link 
                    to={`/admin/categorias/editar/${categoria._id}`} 
                    className="btn btn-sm btn-outline-primary me-2"
                    title="Editar"
                  >
                    Editar
                  </Link>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    title="Eliminar"
                    onClick={() => handleEliminar(categoria._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <ListLayout title="Categorías" entity="Categoría">
      {renderContent()}
    </ListLayout>
  );
};

export default CategoriasList;