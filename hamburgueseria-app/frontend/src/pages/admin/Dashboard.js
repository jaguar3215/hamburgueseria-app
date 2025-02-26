import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import api from '../../services/api';
import MainLayout from '../../components/layout/MainLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    sucursales: 0,
    productos: 0,
    ingredientes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // En una implementación real, aquí cargarías datos desde el backend
  useEffect(() => {
    // Simulamos la carga de datos
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Aquí se reemplazaría con llamadas reales a la API
        // const usuariosResponse = await api.get('/usuarios/count');
        // const sucursalesResponse = await api.get('/sucursales/count');
        // ...
        
        // Por ahora usamos datos ficticios
        setTimeout(() => {
          setStats({
            usuarios: 8,
            sucursales: 3,
            productos: 15,
            ingredientes: 25
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
        setError("No se pudieron cargar los datos del dashboard");
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <MainLayout>
      <h1 className="mb-4">Dashboard de Administración</h1>
      
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando información...</p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="bg-primary text-white rounded-circle p-3 mb-3">
                    <i className="bi bi-people-fill fs-4"></i>
                  </div>
                  <h3>{stats.usuarios}</h3>
                  <p className="text-muted mb-0">Usuarios Registrados</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="bg-success text-white rounded-circle p-3 mb-3">
                    <i className="bi bi-building fs-4"></i>
                  </div>
                  <h3>{stats.sucursales}</h3>
                  <p className="text-muted mb-0">Sucursales Activas</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="bg-info text-white rounded-circle p-3 mb-3">
                    <i className="bi bi-cart-fill fs-4"></i>
                  </div>
                  <h3>{stats.productos}</h3>
                  <p className="text-muted mb-0">Productos</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="bg-warning text-white rounded-circle p-3 mb-3">
                    <i className="bi bi-box-seam fs-4"></i>
                  </div>
                  <h3>{stats.ingredientes}</h3>
                  <p className="text-muted mb-0">Ingredientes</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">Alertas de Inventario</h5>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Queso Cheddar
                    <Badge bg="danger">Stock bajo</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Pan para Hamburguesa
                    <Badge bg="warning">Stock medio</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Carne de Res
                    <Badge bg="success">Stock óptimo</Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">Sucursales</h5>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Sucursal Centro
                    <Badge bg="success">Activa</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Sucursal Norte
                    <Badge bg="success">Activa</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Sucursal Sur
                    <Badge bg="success">Activa</Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </MainLayout>
  );
};

export default AdminDashboard;