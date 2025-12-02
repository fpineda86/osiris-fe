import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 5;

export default function SucursalList({ items, loading, error, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const source = Array.isArray(items) ? items : [];
    if (!term) return source;
    return source.filter(s => (`${s.nombre || ''} ${s.codigo || ''} ${s.empresaLabel || ''}`).toLowerCase().includes(term));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil((filtered?.length || 0) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = (filtered || []).slice(start, start + PAGE_SIZE);

  if (loading) return <p className="muted">Cargando sucursales...</p>;
  if (error) return <p className="error-text">* {String(error)}</p>;

  return (
    <div className="list-shell">
      <div className="list-toolbar">
        <input
          className="input search"
          placeholder="Buscar sucursal"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="muted small">{filtered.length} elemento{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No hay sucursales que coincidan.</p>
      ) : (
        <div className="empresa-list">
          {visible.map(s => (
            <div className="empresa-item" key={s.id ?? s.codigo}>
              <div className="empresa-title">{s.nombre || 'Sin nombre'}</div>
              <div className="empresa-subtitle">{s.empresaLabel || 'Sin empresa'}</div>
              <div className="empresa-meta">
                <span>Codigo: {s.codigo || 'N/A'}</span>
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
