import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MainLayout from '../../../components/layout/MainLayout';
import usuarioService from '../../../services/usuarioService';
import api from '../../../services/api';
import AutorizacionModal from '../../../components/AutorizacionModal';

// Componente para mostrar errores de validación
const ValidationError = ({ name }) => (
  <ErrorMessage 
    name={name} 
    component="div" 
    className="invalid-feedback d-block" 
  />
);

const NuevoUsuario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [showAutorizacion, setShowAutorizacion] = useState(false);
  const [formValues, setFormValues] = useState(null);

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
      .required('La contraseña es obligatoria')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmarContrasena: Yup.string()
      .oneOf([Yup.ref('contrasena'), null], 'Las contraseñas deben coincidir')
      .required('Confirme la contraseña'),
    rol: Yup.string()
      .required('El rol es obligatorio')
      .oneOf(['administrador', 'cajero', 'cocinero'], 'Rol no válido'),
    sucursal: Yup.string()
      .required('La sucursal es obligatoria'),
    codigo_autorizacion: Yup.string()
      .test(
        'codigo-requerido',
        'Código de autorización obligatorio para administradores',
        function(value) {
          return this.parent.rol !== 'administrador' || (this.parent.rol === 'administrador' && !!value);
        }
      )
  });

  // Obtener sucursales al cargar
  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        const response = await api.get('/sucursales');
        // Filtrar solo sucursales activas
        const sucursalesActivas = response.data.data.filter(
          sucursal => sucursal.estado === 'activa'
        );
        setSucursales(sucursalesActivas);
      } catch (err) {
        console.error('Error cargando sucursales:', err);
        setError('Error al cargar las sucursales');
      }
    };

    cargarSucursales();
  }, []);

  // Enviar formulario
  const handleSubmit = (values, { setSubmitting }) => {
    setFormValues(values);
    setShowAutorizacion(true);
    setSubmitting(false);
  };

  // Crear usuario después de autorización
  const crearUsuario = async () => {
    setShowAutorizacion(false);
    setLoading(true);
    
    try {
      await usuarioService.crear(formValues);
      // Redirigir a lista de usuarios tras éxito
      navigate('/admin/usuarios', { 
        state: { message: 'Usuario creado exitosamente' } 
      });
    } catch (err) {
      console.error('Error creando usuario:', err);
      const mensaje = err.response?.data?.message || 'Error al crear el usuario';
      setError(mensaje);
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Nuevo Usuario</h1>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate('/admin/usuarios')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Volver
        </button>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Formulario con Formik */}
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={{
              nombre: '',
              usuario: '',
              contrasena: '',
              confirmarContrasena: '',
              rol: 'cajero', // Valor por defecto
              sucursal: '',
              codigo_autorizacion: '',
              estado: 'activo'
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

                  {/* Contraseña */}
                  <div className="col-md-6">
                    <label htmlFor="contrasena" className="form-label">Contraseña*</label>
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

                  {/* Código de autorización (solo para administradores) */}
                  {values.rol === 'administrador' && (
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
                        Requerido para usuarios con rol de administrador.
                        <br />
                        <span className="text-info">Para pruebas, utilice: <code>ADMIN2025</code></span>
                      </small>
                    </div>
                  )}

                  {/* Estado (oculto, siempre activo al crear) */}
                  <input type="hidden" name="estado" value="activo" />

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
                        {isSubmitting || loading ? 'Creando...' : 'Crear Usuario'}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Modal de autorización */}
      <AutorizacionModal
        show={showAutorizacion}
        onClose={() => setShowAutorizacion(false)}
        onConfirm={crearUsuario}
      />
    </MainLayout>
  );
};

export default NuevoUsuario;