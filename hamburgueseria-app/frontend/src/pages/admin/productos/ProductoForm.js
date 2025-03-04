// src/pages/admin/productos/ProductoForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import productoService from '../../../services/productoService';
import categoriaService from '../../../services/categoriaService';

const ProductoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_base: '',
    categoria: '',
    imagen: '',
    disponible: true,
    para_llevar: 'ambos'
  });
  const [categorias, setCategorias] = useState([]);
  const [opcionesParaLlevar, setOpcionesParaLlevar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Cargar datos necesarios al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener categorías
        const respCategorias = await categoriaService.obtenerTodas();
        setCategorias(respCategorias.data);

        // Obtener opciones para llevar
        const opciones = productoService.obtenerOpcionesParaLlevar();
        setOpcionesParaLlevar(opciones);

        // Si estamos en modo edición, cargar datos del producto
        if (id) {
          setModoEdicion(true);
          await cargarProducto(id);
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setError('Error al cargar los datos necesarios. Intente nuevamente.');
      }
    };

    cargarDatos();
  }, [id]);

  // Función para cargar datos de un producto existente
  const cargarProducto = async (productoId) => {
    try {
      setLoading(true);
      const response = await productoService.obtenerPorId(productoId);
      const producto = response.data.producto;

      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio_base: producto.precio_base,
        categoria: producto.categoria._id,
        imagen: producto.imagen || '',
        disponible: producto.disponible,
        para_llevar: producto.para_llevar
      });

      setError(null);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      setError('Error al cargar los datos del producto');
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
      setError('El nombre del producto es obligatorio');
      return;
    }

    if (!formData.precio_base) {
      setError('El precio base es obligatorio');
      return;
    }

    if (!formData.categoria) {
      setError('Debe seleccionar una categoría');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Asegurar que el precio sea un número
      const datosValidados = {
        ...formData,
        precio_base: Number(formData.precio_base)
      };
      
      if (modoEdicion) {
        // Actualizar producto existente
        await productoService.actualizar(id, datosValidados);
      } else {
        // Crear nuevo producto
        await productoService.crear(datosValidados);
      }
      
      // Redirigir a la lista de productos
      navigate('/admin/productos');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setError(error.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container">
        <h2 className="mb-4">{modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Información General</h5>
              
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre del Producto *</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Hamburguesa Especial"
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
                  placeholder="Descripción del producto..."
                ></textarea>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="precio_base" className="form-label">Precio Base *</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="precio_base"
                      name="precio_base"
                      value={formData.precio_base}
                      onChange={handleNumberChange}
                      required
                      min="0"
                      step="100"
                      placeholder="Ej. 12000"
                    />
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="categoria" className="form-label">Categoría *</label>
                  <select
                    className="form-select"
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria._id} value={categoria._id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="imagen" className="form-label">URL de la Imagen</label>
                <input
                  type="text"
                  className="form-control"
                  id="imagen"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <div className="form-text">Deje en blanco para usar imagen por defecto</div>
              </div>
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Opciones Adicionales</h5>
              
              <div className="mb-3">
                <label htmlFor="para_llevar" className="form-label">Modalidad</label>
                <select
                  className="form-select"
                  id="para_llevar"
                  name="para_llevar"
                  value={formData.para_llevar}
                  onChange={handleChange}
                >
                  {opcionesParaLlevar.map(opcion => (
                    <option key={opcion.valor} value={opcion.valor}>
                      {opcion.etiqueta}
                    </option>
                  ))}
                </select>
                <div className="form-text">Seleccione si el producto está disponible para llevar, solo en local o ambos</div>
              </div>
              
              <div className="mb-3">
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
                    Producto disponible para la venta
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <small className="text-muted">* Campos obligatorios</small>
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
                'Guardar Producto'
              )}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/admin/productos')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default ProductoForm;