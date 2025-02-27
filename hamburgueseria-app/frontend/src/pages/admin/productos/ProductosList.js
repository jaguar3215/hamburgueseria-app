// src/pages/admin/productos/ProductosList.js
import React from 'react';
import ListLayout from '../../../components/layout/ListLayout';

const ProductosList = () => {
  return (
    <ListLayout title="Productos" entity="Producto">
      <div className="alert alert-info">
        Módulo de Productos en desarrollo.
      </div>
    </ListLayout>
  );
};

export default ProductosList;