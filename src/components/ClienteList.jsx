import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 6;

export default function ClienteList({ items, loading, error, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const source = Array.isArray(items) ? items : [];
    if (!term) return source;
    return source.filter(c => (`${c.identificacion || ''} ${c.nombre || ''} ${c.apellido || ''} ${c.email || ''}`).toLowerCase().includes(term));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil((filtered?.length || 0) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = (filtered || []).slice(start, start + PAGE_SIZE);

  if (loading) return <p className="muted">Cargando clientes...</p>;
  if (error) return <p className="error-text">* {String(error)}</p>;

  return (
    <div className="list-shell">
      <div className="list-toolbar">
        <input
          className="input search"
          placeholder="Buscar cliente"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="muted small">{filtered.length} elemento{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No hay clientes que coincidan.</p>
      ) : (
        <div className="empresa-list">
          {visible.map(c => (
            <div className="empresa-item" key={c.id ?? c.identificacion}>
              <div className="empresa-title">{`${c.nombre} ${c.apellido}`.trim() || 'Sin nombre'}</div>
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
