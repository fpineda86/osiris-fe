import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 5;

export default function PuntoEmisionList({ items, loading, error, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const source = Array.isArray(items) ? items : [];
    if (!term) return source;
    return source.filter(p => (
      `${p.descripcion || ''} ${p.codigo || ''} ${p.secuencialActual || ''} ${p.empresaLabel || ''} ${p.sucursalLabel || ''}`
    ).toLowerCase().includes(term));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil((filtered?.length || 0) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = (filtered || []).slice(start, start + PAGE_SIZE);

  if (loading) return <p className="muted">Cargando puntos de emision...</p>;
  if (error) return <p className="error-text">* {String(error)}</p>;

  return (
    <div className="list-shell">
      <div className="list-toolbar">
        <input
          className="input search"
          placeholder="Buscar punto de emision"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="muted small">{filtered.length} elemento{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No hay puntos de emision que coincidan.</p>
      ) : (
        <div className="empresa-list">
          {visible.map(p => (
            <div className="empresa-item" key={p.id ?? p.codigo}>
              <div className="empresa-title">{p.descripcion || 'Sin descripcion'}</div>
              <div className="empresa-subtitle">
                {p.empresaLabel || 'Sin empresa'} {p.sucursalLabel ? `- ${p.sucursalLabel}` : ''}
              </div>
              <div className="empresa-meta">
                <span>Codigo: {p.codigo || 'N/A'}</span>
                <span>Secuencial: {p.secuencialActual ?? 'N/A'}</span>
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
