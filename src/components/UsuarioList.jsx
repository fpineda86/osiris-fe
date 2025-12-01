import React from 'react';

export default function UsuarioList({ items, loading, error, onEdit, onDelete }) {
  if (loading) return <p className="muted">Cargando usuarios...</p>;
  if (error) return <p className="error-text">Error: {String(error)}</p>;
  if (!items || items.length === 0) return <p className="muted">No hay usuarios.</p>;

  return (
    <ul className="item-list">
      {items.map(u => (
        <li key={u.id} className="item-row">
          <div className="item-main">
            <p className="item-title">{u.username}</p>
            <p className="item-sub">
              {u.personaNombre || 'Sin persona'} {u.rolNombre ? `· Rol: ${u.rolNombre}` : ''}
            </p>
          </div>
          <div className="item-actions">
            <button type="button" className="btn-ghost" onClick={() => onEdit(u)}>Editar</button>
            <button type="button" className="btn-danger" onClick={() => onDelete(u)}>Eliminar</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
