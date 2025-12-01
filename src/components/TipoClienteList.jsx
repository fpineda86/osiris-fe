import React from 'react';

export default function TipoClienteList({ items, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <p className="muted">Cargando tipos de cliente...</p>;
  }

  if (error) {
    return <p className="error-text">* {String(error)}</p>;
  }

  if (!items || items.length === 0) {
    return <p className="muted">Aún no hay tipos de cliente.</p>;
  }

  return (
    <div className="empresa-list">
      {items.map(t => (
        <div className="empresa-item" key={t.id ?? t.nombre}>
          <div className="empresa-title">{t.nombre}</div>
          <div className="empresa-meta">
            <span>Descuento: {t.descuento}%</span>
          </div>
          {onEdit && onDelete && (
            <div className="item-actions">
              <button type="button" className="btn-ghost" onClick={() => onEdit(t)}>Editar</button>
              <button type="button" className="btn-secondary" onClick={() => onDelete(t)}>Eliminar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
