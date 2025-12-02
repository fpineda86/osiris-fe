import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 6;

export default function EmpleadoList({ items, loading, error, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const source = Array.isArray(items) ? items : [];
    if (!term) return source;
    return source.filter(e => (
      `${e.personaIdentificacion || ''} ${e.personaNombre || ''} ${e.username || ''} ${e.rolNombre || ''}`
    ).toLowerCase().includes(term));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil((filtered?.length || 0) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = (filtered || []).slice(start, start + PAGE_SIZE);

  if (loading) return <p className="muted">Cargando empleados...</p>;
  if (error) return <p className="error-text">Error: {String(error)}</p>;

  return (
    <div className="list-shell">
      <div className="list-toolbar">
        <input
          className="input search"
          placeholder="Buscar empleado"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="muted small">{filtered.length} elemento{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No hay empleados que coincidan.</p>
      ) : (
        <ul className="item-list">
          {visible.map(e => (
            <li key={e.id} className="item-row">
              <div className="item-main">
                <p className="item-title">
                  {e.personaIdentificacion ? `${e.personaIdentificacion} - ` : ''}
                  {e.personaNombre || 'Empleado'}
                </p>
                <p className="item-sub">
                  {e.username ? `User: ${e.username}` : ''} {e.rolNombre ? `- Rol: ${e.rolNombre}` : ''}
                </p>
              </div>
              <div className="item-actions">
                <button
                  type="button"
                  className="icon-btn edit"
                  title="Editar"
                  aria-label="Editar"
                  onClick={() => onEdit(e)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="icon-btn delete"
                  title="Eliminar"
                  aria-label="Eliminar"
                  onClick={() => onDelete(e)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6 18 20H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </button>
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
