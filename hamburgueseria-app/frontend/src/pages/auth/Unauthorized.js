// src/pages/auth/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="card p-5 shadow">
        <h1 className="text-danger mb-4">Acceso Denegado</h1>
        <p className="lead">No tienes permiso para acceder a esta página.</p>
        <p>Por favor contacta al administrador si crees que esto es un error.</p>
        <div className="mt-4">
          <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;