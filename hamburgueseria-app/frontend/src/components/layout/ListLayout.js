// src/components/layout/ListLayout.js
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from './MainLayout';

const ListLayout = ({ title, entity, children }) => {
  // Función para obtener la ruta correcta según la entidad
  const getEntityPath = () => {
    // Casos especiales
    if (entity === "Categoría") return "categorias";
    if (entity === "Ingrediente") return "ingredientes";
    
    // Caso por defecto (pluralización simple)
    return entity.toLowerCase() + 's';
  };
  
  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{title}</h1>
        <Link to={`/admin/${getEntityPath()}/nuevo`} className="btn btn-primary">
          Nuevo {entity}
        </Link>
      </div>
      {children}
    </MainLayout>
  );
};

export default ListLayout;