import React, { useState } from 'react';

const AutorizacionModal = ({ show, onClose, onConfirm }) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Código predeterminado para desarrollo
  const CODIGO_AUTORIZADO = 'ADMIN2025';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codigo) {
      setError('Por favor ingrese el código de autorización');
      return;
    }

    setLoading(true);
    try {
      // Verificación local para desarrollo
      if (codigo === CODIGO_AUTORIZADO) {
        setTimeout(() => {
          onConfirm();
          setLoading(false);
        }, 1000); // Simulamos un pequeño retraso para mejor UX
      } else {
        setError('Código de autorización incorrecto');
        setLoading(false);
      }
      
      // En producción, descomentar esta línea y comentar la verificación local
      // await usuarioService.verificarCodigo(codigo);
      // onConfirm();
    } catch (err) {
      setError('Código de autorización incorrecto');
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Código de Autorización</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p>Para esta operación, se requiere un código de autorización.</p>
              <p className="text-info mb-3">
                <small>
                  <strong>Nota para desarrollo:</strong> Utilice el código <code>ADMIN2025</code>
                </small>
              </p>
              <div className="mb-3">
                <label htmlFor="codigo" className="form-label">Código:</label>
                <input
                  type="password"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AutorizacionModal;