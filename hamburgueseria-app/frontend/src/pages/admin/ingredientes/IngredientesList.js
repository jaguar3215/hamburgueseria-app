import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListLayout from '../../../components/layout/ListLayout';
import ingredienteService from '../../../services/ingredienteService';

const IngredientesList = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar ingredientes al montar el componente
  useEffect(() => {
    cargarIngredientes();
  }, []);

  // Función para cargar todos los ingredientes
  const cargarIngredientes = async () => {
    try {
      setLoading(true);
      const response = await ingredienteService.obtenerTodos();
      setIngredientes(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar ingredientes:', error);
      setError('Error al cargar los ingredientes. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un ingrediente
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este ingrediente? Esta acción no se puede deshacer.')) {
      try {
        await ingredienteService.eliminar(id);
        alert('Ingrediente eliminado exitosamente');
        // Recargar la lista de ingredientes
        cargarIngredientes();
      } catch (error) {
        console.error('Error al eliminar ingrediente:', error);
        alert('Error al eliminar el ingrediente: ' + error.response?.data?.message || error.message);
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

    if (ingredientes.length === 0) {
      return (
        <div className="alert alert-info">
          No hay ingredientes registrados. Crea un nuevo ingrediente para comenzar.
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Precio Adicional</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Unidad</th>
              <th>Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map(ingrediente => (
              <tr key={ingrediente._id} className={ingrediente.stock <= ingrediente.stock_minimo ? 'table-warning' : ''}>
                <td>{ingrediente.nombre}</td>
                <td>${ingrediente.precio_adicional?.toLocaleString() || 0}</td>
                <td>
                  {ingrediente.stock} {ingrediente.unidad_medida}
                </td>
                <td>{ingrediente.stock_minimo} {ingrediente.unidad_medida}</td>
                <td>{ingrediente.unidad_medida}</td>
                <td>
                  <span className={`badge ${ingrediente.disponible ? 'bg-success' : 'bg-danger'}`}>
                    {ingrediente.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/admin/ingredientes/editar/${ingrediente._id}`} 
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    Editar
                  </Link>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleEliminar(ingrediente._id)}
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
    <ListLayout title="Ingredientes" entity="Ingrediente">
      {renderContent()}
    </ListLayout>
  );
};

export default IngredientesList;