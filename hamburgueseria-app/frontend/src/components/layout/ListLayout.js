// src/components/layout/ListLayout.js
import React from 'react';
import MainLayout from './MainLayout';

const ListLayout = ({ title, entity, children }) => {
  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{title}</h1>
        <button className="btn btn-primary">
          Nuevo {entity}
        </button>
      </div>
      {children}
    </MainLayout>
  );
};

export default ListLayout;