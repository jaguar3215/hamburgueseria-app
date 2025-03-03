import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import categoriaService from '../../../services/categoriaService';

const CategoriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (id) {
      setModoEdicion(true);
      cargarCategoria(id);
    }
  }, [id]);

  // Función para cargar datos de una categoría
  const cargarCategoria = async (categoriaId) => {
    try {
      setLoading(true);
      const response = await categoriaService.obtenerPorId(categoriaId);
      const categoria = response.data;
      
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || ''
      });
      
      setError(null);
    } catch (error) {
      console.error('Error al cargar categoría:', error);
      setError('Error al cargar los datos de la categoría');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (modoEdicion) {
        // Actualizar categoría existente
        await categoriaService.actualizar(id, formData);
      } else {
        // Crear nueva categoría
        await categoriaService.crear(formData);
      }
      
      // Redirigir a la lista de categorías
      navigate('/admin/categorias');
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setError(error.response?.data?.message || 'Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre de la Categoría</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej. Hamburguesas"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
            placeholder="Ej. Todas las variedades de hamburguesas disponibles"
          ></textarea>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/categorias')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriaForm;