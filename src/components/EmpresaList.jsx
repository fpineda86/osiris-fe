import React from 'react';

export default function EmpresaList({ items, loading, error, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="panel-card">
        <p className="muted">Cargando empresas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-card error">
        <p className="muted">No se pudo cargar: {String(error)}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="panel-card empty">
        <p className="muted">Aún no hay empresas creadas.</p>
      </div>
    );
  }

  return (
    <div className="empresa-list">
      {items.map(e => (
        <div className="empresa-item" key={e.id ?? e.razonSocial}>
          <div className="empresa-title">{e.razonSocial}</div>
          {e.nombreComercial && <div className="empresa-subtitle">{e.nombreComercial}</div>}
          <div className="empresa-meta">
            <span>RUC: {e.ruc || '—'}</span>
            <span>{e.direccionMatriz || 'Sin dirección'}</span>
            {e.telefono && <span>Tel: {e.telefono}</span>}
            {e.codigoEstablecimiento && <span>Estab: {e.codigoEstablecimiento}</span>}
          </div>
          {onEdit && onDelete && (
            <div className="item-actions">
              <button type="button" className="btn-ghost" onClick={() => onEdit(e)}>Editar</button>
              <button type="button" className="btn-secondary" onClick={() => onDelete(e)}>Eliminar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
