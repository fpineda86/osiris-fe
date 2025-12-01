import React from 'react';

export default function SucursalList({ items, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <p className="muted">Cargando sucursales...</p>;
  }

  if (error) {
    return <p className="error-text">* {String(error)}</p>;
  }

  if (!items || items.length === 0) {
    return <p className="muted">Aún no hay sucursales activas.</p>;
  }

  return (
    <div className="empresa-list">
      {items.map(s => (
        <div className="empresa-item" key={s.id ?? s.codigo}>
          <div className="empresa-title">{s.nombre}</div>
          <div className="empresa-meta">
            <span>Código: {s.codigo}</span>
            {s.telefono && <span>Tel: {s.telefono}</span>}
            {s.direccion && <span>{s.direccion}</span>}
          </div>
          {onEdit && onDelete && (
            <div className="item-actions">
              <button type="button" className="btn-ghost" onClick={() => onEdit(s)}>Editar</button>
              <button type="button" className="btn-secondary" onClick={() => onDelete(s)}>Eliminar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
