// src/pages/admin/productos/ProductoOpciones.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import productoService from '../../../services/productoService';
import ingredienteService from '../../../services/ingredienteService';
import opcionProductoService from '../../../services/opcionProductoService';

const ProductoOpciones = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [producto, setProducto] = useState(null);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [opcionesActuales, setOpcionesActuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  
  // Cargar datos del producto y sus opciones
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener producto
        const respProducto = await productoService.obtenerPorId(id);
        setProducto(respProducto.data.producto);
        setOpcionesActuales(respProducto.data.opciones_ingredientes);
        
        // Obtener ingredientes disponibles
        const respIngredientes = await ingredienteService.obtenerTodos({ disponible: true });
        setIngredientesDisponibles(respIngredientes.data);
        
        setError(null);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos del producto y sus ingredientes');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      cargarDatos();
    }
  }, [id]);
  
  // Agregar un nuevo ingrediente a las opciones
  const agregarOpcion = (ingredienteId) => {
    // Verificar si ya existe este ingrediente en las opciones
    const yaExiste = opcionesActuales.some(
      opcion => opcion.ingrediente._id === ingredienteId
    );
    
    if (yaExiste) {
      alert('Este ingrediente ya está en la lista de opciones');
      return;
    }
    
    // Buscar el ingrediente completo para mostrarlo en la lista
    const ingrediente = ingredientesDisponibles.find(ing => ing._id === ingredienteId);
    
    if (!ingrediente) {
      alert('Ingrediente no encontrado');
      return;
    }
    
    // Agregar nueva opción
    const nuevaOpcion = {
      _id: `temp_${Date.now()}`, // ID temporal para manejo en frontend
      producto: id,
      ingrediente: ingrediente,
      es_predeterminado: true,
      es_removible: true,
      cantidad_predeterminada: 1,
      esNueva: true // Para identificar que es una nueva opción
    };
    
    setOpcionesActuales([...opcionesActuales, nuevaOpcion]);
  };
  
  // Eliminar una opción
  const eliminarOpcion = (opcionId) => {
    setOpcionesActuales(
      opcionesActuales.filter(opcion => opcion._id !== opcionId)
    );
  };
  
  // Cambiar propiedades de una opción
  const cambiarOpcion = (opcionId, propiedad, valor) => {
    setOpcionesActuales(
      opcionesActuales.map(opcion => 
        opcion._id === opcionId
          ? { ...opcion, [propiedad]: valor }
          : opcion
      )
    );
  };
  
  // Guardar todas las opciones
  const guardarOpciones = async () => {
    try {
      setGuardando(true);
      setError(null);
      
      // Preparar opciones para enviar
      const opcionesParaEnviar = opcionesActuales.map(opcion => ({
        ingrediente: opcion.ingrediente._id,
        es_predeterminado: opcion.es_predeterminado,
        es_removible: opcion.es_removible,
        cantidad_predeterminada: opcion.cantidad_predeterminada
      }));
      
      // Enviar al backend
      await productoService.actualizarOpciones(id, opcionesParaEnviar);
      
      // Redirigir a la lista de productos
      navigate('/admin/productos');
    } catch (error) {
      console.error('Error al guardar opciones:', error);
      setError('Error al guardar las opciones de ingredientes');
    } finally {
      setGuardando(false);
    }
  };
  
  // Obtener ingredientes no utilizados
  const ingredientesNoUtilizados = ingredientesDisponibles.filter(ingrediente => 
    !opcionesActuales.some(opcion => opcion.ingrediente._id === ingrediente._id)
  );

  return (
    <MainLayout>
      <div className="container">
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : producto ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Opciones de Ingredientes</h2>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/admin/productos')}
              >
                Volver a Productos
              </button>
            </div>
            
            <div className="alert alert-info mb-4">
              <h5 className="alert-heading">Producto: {producto.nombre}</h5>
              <p className="mb-0">Configure los ingredientes que pueden añadirse a este producto.</p>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-header bg-light">
                    <h5 className="card-title mb-0">Ingredientes Disponibles</h5>
                  </div>
                  <div className="card-body">
                    {ingredientesNoUtilizados.length === 0 ? (
                      <p className="text-muted">No hay más ingredientes disponibles para añadir.</p>
                    ) : (
                      <div className="list-group">
                        {ingredientesNoUtilizados.map(ingrediente => (
                          <button
                            key={ingrediente._id}
                            type="button"
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            onClick={() => agregarOpcion(ingrediente._id)}
                          >
                            <span>{ingrediente.nombre}</span>
                            <span className="badge bg-primary rounded-pill">+</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header bg-light">
                    <h5 className="card-title mb-0">Opciones Configuradas</h5>
                  </div>
                  <div className="card-body">
                    {opcionesActuales.length === 0 ? (
                      <div className="alert alert-warning">
                        Este producto no tiene ingredientes configurados. Añada al menos uno.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Ingrediente</th>
                              <th>Predeterminado</th>
                              <th>Removible</th>
                              <th>Cantidad</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {opcionesActuales.map(opcion => (
                              <tr key={opcion._id}>
                                <td>{opcion.ingrediente.nombre}</td>
                                <td>
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={opcion.es_predeterminado}
                                      onChange={() => cambiarOpcion(opcion._id, 'es_predeterminado', !opcion.es_predeterminado)}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={opcion.es_removible}
                                      onChange={() => cambiarOpcion(opcion._id, 'es_removible', !opcion.es_removible)}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    value={opcion.cantidad_predeterminada}
                                    onChange={e => cambiarOpcion(opcion._id, 'cantidad_predeterminada', Number(e.target.value))}
                                    min="1"
                                    max="10"
                                    style={{ width: '70px' }}
                                  />
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => eliminarOpcion(opcion._id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-primary"
                        onClick={guardarOpciones}
                        disabled={guardando}
                      >
                        {guardando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Guardando...
                          </>
                        ) : (
                          'Guardar Opciones'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="alert alert-danger">
            Producto no encontrado o ha ocurrido un error al cargarlo.
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductoOpciones;