import React from 'react';

export default function RolList({ items, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <p className="muted">Cargando roles...</p>;
  }

  if (error) {
    return <p className="error-text">* {String(error)}</p>;
  }

  if (!items || items.length === 0) {
    return <p className="muted">Aún no hay roles.</p>;
  }

  return (
    <div className="empresa-list">
      {items.map(r => (
        <div className="empresa-item" key={r.id ?? r.nombre}>
          <div className="empresa-title">{r.nombre}</div>
          <div className="empresa-meta">
            <span>{r.descripcion}</span>
          </div>
          {onEdit && onDelete && (
            <div className="item-actions">
              <button type="button" className="btn-ghost" onClick={() => onEdit(r)}>Editar</button>
              <button type="button" className="btn-secondary" onClick={() => onDelete(r)}>Eliminar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
