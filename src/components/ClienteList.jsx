import React from 'react';

export default function ClienteList({ items, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <p className="muted">Cargando clientes...</p>;
  }

  if (error) {
    return <p className="error-text">* {String(error)}</p>;
  }

  if (!items || items.length === 0) {
    return <p className="muted">Aun no hay clientes.</p>;
  }

  return (
    <div className="empresa-list">
      {items.map(c => (
        <div className="empresa-item" key={c.id ?? c.identificacion}>
          <div className="empresa-title">{c.nombre} {c.apellido}</div>
          <div className="empresa-meta">
            <span>{c.tipoIdentificacion}: {c.identificacion}</span>
            {c.email && <span>{c.email}</span>}
            {c.telefono && <span>Tel: {c.telefono}</span>}
          </div>
          <div className="empresa-meta">
            {c.direccion && <span>{c.direccion}</span>}
            {c.ciudad && <span>{c.ciudad}</span>}
          </div>
          {onEdit && onDelete && (
            <div className="item-actions">
              <button type="button" className="btn-ghost" onClick={() => onEdit(c)}>Editar</button>
              <button type="button" className="btn-secondary" onClick={() => onDelete(c)}>Eliminar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
