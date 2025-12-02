import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 6;

export default function UsuarioList({ items, loading, error, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const source = Array.isArray(items) ? items : [];
    if (!term) return source;
    return source.filter(u => (`${u.username || ''} ${u.personaNombre || ''} ${u.rolNombre || ''}`).toLowerCase().includes(term));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil((filtered?.length || 0) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = (filtered || []).slice(start, start + PAGE_SIZE);

  if (loading) return <p className="muted">Cargando usuarios...</p>;
  if (error) return <p className="error-text">Error: {String(error)}</p>;

  return (
    <div className="list-shell">
      <div className="list-toolbar">
        <input
          className="input search"
          placeholder="Buscar usuario"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="muted small">{filtered.length} elemento{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No hay usuarios que coincidan.</p>
      ) : (
        <ul className="item-list">
          {visible.map(u => (
            <li key={u.id} className="item-row">
              <div className="item-main">
                <p className="item-title">{u.username}</p>
                <p className="item-sub">
                  {u.personaNombre || 'Sin persona'} {u.rolNombre ? `- Rol: ${u.rolNombre}` : ''}
                </p>
              </div>
              <div className="item-actions">
                <button type="button" className="btn-ghost" onClick={() => onEdit(u)}>Editar</button>
                <button type="button" className="btn-danger" onClick={() => onDelete(u)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="pager">
          <button type="button" disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            Anterior
          </button>
          <span className="muted small">Pagina {currentPage} de {totalPages}</span>
          <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
