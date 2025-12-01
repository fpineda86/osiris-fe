import React from 'react';

export default function PuntoEmisionList({ items, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <p className="muted">Cargando puntos de emisión...</p>;
  }

  if (error) {
    return <p className="error-text">* {String(error)}</p>;
  }

  if (!items || items.length === 0) {
    return <p className="muted">Aún no hay puntos de emisión activos.</p>;
  }

  return (
    <div className="empresa-list">
      {items.map(p => (
        <div className="empresa-item" key={p.id ?? p.codigo}>
          <div className="empresa-title">{p.descripcion}</div>
          <div className="empresa-meta">
            <span>Código: {p.codigo}</span>
            <span>Secuencial: {p.secuencialActual}</span>
          </div>
          {onEdit && onDelete && (
            <div className="item-actions">
              <button type="button" className="btn-ghost" onClick={() => onEdit(p)}>Editar</button>
              <button type="button" className="btn-secondary" onClick={() => onDelete(p)}>Eliminar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
