import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    usuario: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      redirectUserByRole(user);
    }
  }, [user]);
  
  const redirectUserByRole = (userData) => {
    if (userData.rol === 'administrador') {
      navigate('/admin/dashboard');
    } else if (userData.rol === 'cajero') {
      navigate('/cajero/ventas');
    } else if (userData.rol === 'cocinero') {
      navigate('/cocinero/pedidos');
    } else {
      setError('El usuario no tiene un rol válido');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(credentials);
      
      if (!success) {
        setError('Credenciales inválidas');
      }
      // No es necesario manejar la redirección aquí, el useEffect se encargará
      // cuando el estado del usuario cambie
    } catch (err) {
      console.error("Error en login:", err);
      setError(`Error al iniciar sesión: ${err.message || 'Intente nuevamente'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">JQ Q Berraquera</h2>
                <p className="text-muted">Sistema de Gestión</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="usuario"
                    value={credentials.usuario}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="contrasena"
                    value={credentials.contrasena}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="py-2"
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;