import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MainLayout from '../../../components/layout/MainLayout';
import usuarioService from '../../../services/usuarioService';
import api from '../../../services/api';
import { AuthContext } from '../../../context/AuthContext';
import AutorizacionModal from '../../../components/AutorizacionModal';

// Componente para mostrar errores de validación
const ValidationError = ({ name }) => (
  <ErrorMessage 
    name={name} 
    component="div" 
    className="invalid-feedback d-block" 
  />
);


const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [showAutorizacion, setShowAutorizacion] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [cambioContrasena, setCambioContrasena] = useState(false);

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required('El nombre es obligatorio')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres'),
    usuario: Yup.string()
      .required('El nombre de usuario es obligatorio')
      .min(3, 'El usuario debe tener al menos 3 caracteres')
      .max(20, 'El usuario no puede exceder 20 caracteres')
      .matches(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números, puntos, guiones y guiones bajos'),
    contrasena: Yup.string()
      .test(
        'contrasena-requerida',
        'La contraseña es obligatoria y debe tener al menos 6 caracteres',
        function(value) {
          if (!cambioContrasena) return true;
          if (!value) return false;
          return value.length >= 6;
        }
      ),
    confirmarContrasena: Yup.string()
      .test(
        'contrasenas-coinciden',
        'Las contraseñas deben coincidir',
        function(value) {
          return !cambioContrasena || (cambioContrasena && value === this.parent.contrasena);
        }
      ),
    rol: Yup.string()
      .required('El rol es obligatorio')
      .oneOf(['administrador', 'cajero', 'cocinero'], 'Rol no válido'),
    sucursal: Yup.string()
      .required('La sucursal es obligatoria'),
    estado: Yup.string()
      .required('El estado es obligatorio')
      .oneOf(['activo', 'inactivo'], 'Estado no válido'),
    codigo_autorizacion: Yup.string()
      .test(
        'codigo-requerido', 
        'Código de autorización obligatorio para administradores',
        function(value) {
          // Solo requerido si el rol cambia a admin o ya era admin
          const originalRol = usuario?.rol;
          const newRol = this.parent.rol;
          if (newRol === 'administrador' && originalRol !== 'administrador') {
            return !!value;
          }
          return true;
        }
      )
  });

  // Cargar datos del usuario y sucursales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Cargar datos del usuario
        const usuarioResponse = await usuarioService.obtenerPorId(id);
        setUsuario(usuarioResponse.data);
        
        // Cargar sucursales
        const sucursalesResponse = await api.get('/sucursales');
        setSucursales(sucursalesResponse.data.data);
        
        setError(null);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  // Verificar si el usuario actual puede editar
  const puedeEditar = () => {
    if (!user || !usuario) return false;
    
    // Administrador puede editar cualquier usuario
    if (user.rol === 'administrador') return true;
    
    // Usuario puede editar sus propios datos
    return user._id === usuario._id;
  };

  // Enviar formulario
  const handleSubmit = (values, { setSubmitting }) => {
    // Si es admin o cambia a admin, mostrar modal
    if (values.rol === 'administrador' || cambioRolSensible(values)) {
      setFormValues(values);
      setShowAutorizacion(true);
    } else {
      // Para roles normales, actualizar directamente
      actualizarUsuario(values);
    }
    setSubmitting(false);
  };

  // Verifica si el cambio de rol es sensible
  const cambioRolSensible = (values) => {
    if (!usuario) return false;
    
    // Cambios de rol que requieren autorización
    return (
      (usuario.rol !== 'administrador' && values.rol === 'administrador') ||
      (usuario.rol === 'administrador' && values.rol !== 'administrador')
    );
  };

  // Actualizar usuario después de autorización
  const actualizarUsuario = async (values) => {
    setLoading(true);
    
    try {
      // Si no hay cambio de contraseña, eliminarla del objeto
      const datosActualizados = { ...values };
      if (!cambioContrasena) {
        delete datosActualizados.contrasena;
        delete datosActualizados.confirmarContrasena;
      }
      
      // Actualizar usuario
      await usuarioService.actualizar(id, datosActualizados);
      
      // Redirigir a lista de usuarios tras éxito
      navigate('/admin/usuarios', { 
        state: { message: 'Usuario actualizado exitosamente' } 
      });
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      const mensaje = err.response?.data?.message || 'Error al actualizar el usuario';
      setError(mensaje);
      setLoading(false);
    }
  };

  // Manejar confirmación del modal
  const confirmarAutorizacion = () => {
    setShowAutorizacion(false);
    actualizarUsuario(formValues);
  };

  if (loading && !usuario) {
    return (
      <MainLayout>
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error && !usuario) {
    return (
      <MainLayout>
        <div className="alert alert-danger">{error}</div>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate('/admin/usuarios')}
        >
          <i className="bi bi-arrow-left me-2"></i>Volver
        </button>
      </MainLayout>
    );
  }

  if (!puedeEditar()) {
    return (
      <MainLayout>
        <div className="alert alert-danger">
          No tiene permisos para editar este usuario
        </div>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate('/admin/usuarios')}
        >
          <i className="bi bi-arrow-left me-2"></i>Volver
        </button>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Editar Usuario</h1>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate('/admin/usuarios')}
        >
          <i className="bi bi-arrow-left me-2"></i>Volver
        </button>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Formulario con Formik */}
      {usuario && (
        <div className="card">
          <div className="card-body">
            <Formik
              initialValues={{
                nombre: usuario.nombre || '',
                usuario: usuario.usuario || '',
                contrasena: '',
                confirmarContrasena: '',
                rol: usuario.rol || '',
                sucursal: usuario.sucursal?._id || usuario.sucursal || '',
                estado: usuario.estado || 'activo',
                codigo_autorizacion: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                  <div className="row g-3">
                    {/* Nombre completo */}
                    <div className="col-md-6">
                      <label htmlFor="nombre" className="form-label">Nombre Completo*</label>
                      <Field
                        type="text"
                        id="nombre"
                        name="nombre"
                        className={`form-control ${errors.nombre && touched.nombre ? 'is-invalid' : ''}`}
                      />
                      <ValidationError name="nombre" />
                    </div>

                    {/* Nombre de usuario */}
                    <div className="col-md-6">
                      <label htmlFor="usuario" className="form-label">Nombre de Usuario*</label>
                      <Field
                        type="text"
                        id="usuario"
                        name="usuario"
                        className={`form-control ${errors.usuario && touched.usuario ? 'is-invalid' : ''}`}
                      />
                      <ValidationError name="usuario" />
                    </div>

                    {/* Opción para cambiar contraseña */}
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="cambioContrasena"
                          checked={cambioContrasena}
                          onChange={(e) => setCambioContrasena(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="cambioContrasena">
                          Cambiar contraseña
                        </label>
                      </div>
                    </div>

                    {/* Contraseña */}
                    {cambioContrasena && (
                      <>
                        <div className="col-md-6">
                          <label htmlFor="contrasena" className="form-label">Nueva Contraseña*</label>
                          <Field
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            className={`form-control ${errors.contrasena && touched.contrasena ? 'is-invalid' : ''}`}
                          />
                          <ValidationError name="contrasena" />
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="col-md-6">
                          <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña*</label>
                          <Field
                            type="password"
                            id="confirmarContrasena"
                            name="confirmarContrasena"
                            className={`form-control ${errors.confirmarContrasena && touched.confirmarContrasena ? 'is-invalid' : ''}`}
                          />
                          <ValidationError name="confirmarContrasena" />
                        </div>
                      </>
                    )}

                    {/* Rol */}
                    <div className="col-md-6">
                      <label htmlFor="rol" className="form-label">Rol*</label>
                      <Field
                        as="select"
                        id="rol"
                        name="rol"
                        className={`form-select ${errors.rol && touched.rol ? 'is-invalid' : ''}`}
                      >
                        {usuarioService.obtenerRoles().map(rol => (
                          <option key={rol.valor} value={rol.valor}>
                            {rol.etiqueta}
                          </option>
                        ))}
                      </Field>
                      <ValidationError name="rol" />
                    </div>

                    {/* Sucursal */}
                    <div className="col-md-6">
                      <label htmlFor="sucursal" className="form-label">Sucursal*</label>
                      <Field
                        as="select"
                        id="sucursal"
                        name="sucursal"
                        className={`form-select ${errors.sucursal && touched.sucursal ? 'is-invalid' : ''}`}
                      >
                        <option value="">Seleccione una sucursal</option>
                        {sucursales.map(sucursal => (
                          <option key={sucursal._id} value={sucursal._id}>
                            {sucursal.nombre}
                          </option>
                        ))}
                      </Field>
                      <ValidationError name="sucursal" />
                    </div>

                    {/* Estado */}
                    <div className="col-md-6">
                      <label htmlFor="estado" className="form-label">Estado*</label>
                      <Field
                        as="select"
                        id="estado"
                        name="estado"
                        className={`form-select ${errors.estado && touched.estado ? 'is-invalid' : ''}`}
                        disabled={usuario.usuario === 'admin'} // Proteger usuario admin
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </Field>
                      <ValidationError name="estado" />
                    </div>

                    {/* Código de autorización (solo para cambios a administrador) */}
                    {values.rol === 'administrador' && usuario.rol !== 'administrador' && (
                      <div className="col-md-6">
                        <label htmlFor="codigo_autorizacion" className="form-label">
                          Código de Autorización*
                        </label>
                        <Field
                          type="password"
                          id="codigo_autorizacion"
                          name="codigo_autorizacion"
                          className={`form-control ${errors.codigo_autorizacion && touched.codigo_autorizacion ? 'is-invalid' : ''}`}
                        />
                        <ValidationError name="codigo_autorizacion" />
                        <small className="form-text text-muted">
                          Requerido al cambiar el rol a administrador.
                          <br />
                          <span className="text-info">Para pruebas, utilice: <code>ADMIN2025</code></span>
                        </small>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="col-12 mt-4">
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={() => navigate('/admin/usuarios')}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting || loading}
                        >
                          {isSubmitting || loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal de autorización */}
      <AutorizacionModal
        show={showAutorizacion}
        onClose={() => setShowAutorizacion(false)}
        onConfirm={confirmarAutorizacion}
      />
    </MainLayout>
  );
};

export default EditarUsuario;