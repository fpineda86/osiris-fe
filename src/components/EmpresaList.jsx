import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 5;

export default function EmpresaList({ items, loading, error, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const source = Array.isArray(items) ? items : [];
    if (!term) return source;
    return source.filter(e => (`${e.razonSocial || ''} ${e.nombreComercial || ''} ${e.ruc || ''}`).toLowerCase().includes(term));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil((filtered?.length || 0) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = (filtered || []).slice(start, start + PAGE_SIZE);

  if (loading) {
    return (
      <div className="panel-card">
        <p className="muted">Cargando empresas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-card error">
        <p className="muted">No se pudo cargar: {String(error)}</p>
      </div>
    );
  }

  return (
    <div className="list-shell">
      <div className="list-toolbar">
        <input
          className="input search"
          placeholder="Buscar empresa"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="muted small">
          {filtered.length} encontrado{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {visible.length === 0 ? (
        <div className="panel-card empty">
          <p className="muted">No hay empresas que coincidan.</p>
        </div>
      ) : (
        <div className="empresa-list">
          {visible.map(e => (
            <div className="empresa-item" key={e.id ?? e.razonSocial}>
              <div className="empresa-title">{e.razonSocial || 'Sin razon social'}</div>
              {e.nombreComercial && <div className="empresa-subtitle">{e.nombreComercial}</div>}
              <div className="empresa-meta">
                <span>RUC: {e.ruc || 'N/A'}</span>
                <span>{e.direccionMatriz || 'Sin direccion'}</span>
                {e.telefono && <span>Tel: {e.telefono}</span>}
                {e.codigoEstablecimiento && <span>Estab: {e.codigoEstablecimiento}</span>}
              </div>
              {onEdit && onDelete && (
                <div className="item-actions">
                  <button type="button" className="btn-ghost" onClick={() => onEdit(e)}>Editar</button>
                  <button type="button" className="btn-secondary" onClick={() => onDelete(e)}>Eliminar</button>
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
          <span className="muted small">
            Pagina {currentPage} de {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
