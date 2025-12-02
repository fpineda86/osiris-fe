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
                  {e.username ? `User: ${e.username}` : ''} {e.rolNombre ? `- Rol: ${e.rolNombre}` : ''} {e.salario ? `- Salario: ${e.salario}` : ''}
                </p>
              </div>
              <div className="item-actions">
                <button type="button" className="btn-ghost" onClick={() => onEdit(e)}>Editar</button>
                <button type="button" className="btn-danger" onClick={() => onDelete(e)}>Eliminar</button>
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
