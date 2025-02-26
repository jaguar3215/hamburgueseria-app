import React, { useContext } from 'react';
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Determinar elementos de menú según el rol
  const getMenuItems = () => {
    if (!user) return null;
    
    switch (user.rol) {
      case 'administrador':
        return (
          <>
            <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/sucursales">Sucursales</Nav.Link>
            <Nav.Link as={Link} to="/admin/usuarios">Usuarios</Nav.Link>
            <Nav.Link as={Link} to="/admin/productos">Productos</Nav.Link>
            <Nav.Link as={Link} to="/admin/categorias">Categorías</Nav.Link>
            <Nav.Link as={Link} to="/admin/ingredientes">Ingredientes</Nav.Link>
            <Nav.Link as={Link} to="/admin/reportes">Reportes</Nav.Link>
          </>
        );
      case 'cajero':
        return (
          <>
            <Nav.Link as={Link} to="/cajero/ventas">Ventas</Nav.Link>
            <Nav.Link as={Link} to="/cajero/caja">Caja</Nav.Link>
            <Nav.Link as={Link} to="/cajero/historial">Historial</Nav.Link>
          </>
        );
      case 'cocinero':
        return (
          <>
            <Nav.Link as={Link} to="/cocinero/pedidos">Pedidos</Nav.Link>
            <Nav.Link as={Link} to="/cocinero/inventario">Inventario</Nav.Link>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">JQ Q Berraquera</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {getMenuItems()}
            </Nav>
            <Nav>
              {user && (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                    {user.nombre || user.usuario}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as="button" disabled>
                      Rol: {user.rol}
                    </Dropdown.Item>
                    <Dropdown.Item as="button" disabled>
                      Sucursal: {user.sucursal ? user.sucursal.nombre : 'N/A'}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as="button" onClick={handleLogout}>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Container className="flex-grow-1 mb-4">
        {children}
      </Container>
      
      <footer className="bg-light py-3 mt-auto">
        <Container className="text-center text-muted">
          <small>Sistema de Gestión JQ Q Berraquera &copy; {new Date().getFullYear()}</small>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;