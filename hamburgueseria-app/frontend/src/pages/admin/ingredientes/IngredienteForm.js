import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ingredienteService from '../../../services/ingredienteService';

const IngredienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    precio_adicional: 0,
    disponible: true,
    stock: 0,
    stock_minimo: 10,
    unidad_medida: 'unidades',
    unidad_personalizada: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState([]);

  // Cargar datos si estamos en modo edición y obtener unidades de medida
  useEffect(() => {
    setUnidadesMedida(ingredienteService.obtenerUnidadesMedida());
    
    if (id) {
      setModoEdicion(true);
      cargarIngrediente(id);
    }
  }, [id]);

  // Función para cargar datos de un ingrediente
  const cargarIngrediente = async (ingredienteId) => {
    try {
      setLoading(true);
      const response = await ingredienteService.obtenerPorId(ingredienteId);
      const ingrediente = response.data;
      
      // Verificar si es una unidad personalizada
      const unidadEstandar = unidadesMedida.find(u => u.valor === ingrediente.unidad_medida);
      
      setFormData({
        nombre: ingrediente.nombre,
        precio_adicional: ingrediente.precio_adicional || 0,
        disponible: ingrediente.disponible,
        stock: ingrediente.stock || 0,
        stock_minimo: ingrediente.stock_minimo || 10,
        unidad_medida: unidadEstandar ? ingrediente.unidad_medida : 'personalizada',
        unidad_personalizada: unidadEstandar ? '' : ingrediente.unidad_medida
      });
      
      setError(null);
    } catch (error) {
      console.error('Error al cargar ingrediente:', error);
      setError('Error al cargar los datos del ingrediente');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Manejar cambios en campos numéricos
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === '' ? '' : Number(value)
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim()) {
      setError('El nombre del ingrediente es obligatorio');
      return;
    }

    // Determinar la unidad de medida final
    const unidadMedidaFinal = formData.unidad_medida === 'personalizada' 
      ? formData.unidad_personalizada 
      : formData.unidad_medida;
    
    // Asegurar que los valores numéricos sean números
    const datosValidados = {
      nombre: formData.nombre,
      precio_adicional: Number(formData.precio_adicional),
      disponible: formData.disponible,
      stock: Number(formData.stock),
      stock_minimo: Number(formData.stock_minimo),
      unidad_medida: unidadMedidaFinal
    };
    
    try {
      setLoading(true);
      setError(null);
      
      if (modoEdicion) {
        // Actualizar ingrediente existente
        await ingredienteService.actualizar(id, datosValidados);
      } else {
        // Crear nuevo ingrediente
        await ingredienteService.crear(datosValidados);
      }
      
      // Redirigir a la lista de ingredientes
      navigate('/admin/ingredientes');
    } catch (error) {
      console.error('Error al guardar ingrediente:', error);
      setError(error.response?.data?.message || 'Error al guardar el ingrediente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{modoEdicion ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre del Ingrediente</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej. Queso Cheddar"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="precio_adicional" className="form-label">Precio Adicional</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              className="form-control"
              id="precio_adicional"
              name="precio_adicional"
              value={formData.precio_adicional}
              onChange={handleNumberChange}
              min="0"
              step="100"
              placeholder="Ej. 2000"
            />
          </div>
          <div className="form-text">Precio que se cobra cuando este ingrediente se añade extra a un producto.</div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="stock" className="form-label">Stock Actual</label>
            <input
              type="number"
              className="form-control"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleNumberChange}
              min="0"
              placeholder="Ej. 100"
            />
          </div>
          
          <div className="col-md-4">
            <label htmlFor="stock_minimo" className="form-label">Stock Mínimo</label>
            <input
              type="number"
              className="form-control"
              id="stock_minimo"
              name="stock_minimo"
              value={formData.stock_minimo}
              onChange={handleNumberChange}
              min="0"
              placeholder="Ej. 10"
            />
            <div className="form-text">Cantidad mínima antes de mostrar alerta.</div>
          </div>
          
          <div className="col-md-4">
            <label htmlFor="unidad_medida" className="form-label">Unidad de Medida</label>
            <select
              className="form-select"
              id="unidad_medida"
              name="unidad_medida"
              value={formData.unidad_medida}
              onChange={handleChange}
            >
              {unidadesMedida.map(unidad => (
                <option key={unidad.valor} value={unidad.valor}>
                  {unidad.etiqueta}
                </option>
              ))}
              <option value="personalizada">Otra (personalizada)</option>
            </select>
          </div>
        </div>
        
        {formData.unidad_medida === 'personalizada' && (
          <div className="mb-3">
            <label htmlFor="unidad_personalizada" className="form-label">Unidad Personalizada</label>
            <input
              type="text"
              className="form-control"
              id="unidad_personalizada"
              name="unidad_personalizada"
              value={formData.unidad_personalizada}
              onChange={handleChange}
              placeholder="Ej. Canastas, Cubetas, etc."
            />
          </div>
        )}
        
        <div className="mb-4">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="disponible"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="disponible">
              Disponible para usar en productos
            </label>
          </div>
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
            onClick={() => navigate('/admin/ingredientes')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default IngredienteForm;