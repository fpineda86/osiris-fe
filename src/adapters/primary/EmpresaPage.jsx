import React, { useEffect, useMemo, useState } from 'react';
import GetEmpresas from '../../domain/usecases/GetEmpresas.js';
import CreateEmpresa from '../../domain/usecases/CreateEmpresa.js';
import UpdateEmpresa from '../../domain/usecases/UpdateEmpresa.js';
import DeleteEmpresa from '../../domain/usecases/DeleteEmpresa.js';
import EmpresaApiAdapter from '../secondary/EmpresaApiAdapter.js';
import EmpresaList from '../../components/EmpresaList.jsx';
import EmpresaForm from '../../components/EmpresaForm.jsx';

export default function EmpresaPage() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState(null);
  const [flash, setFlash] = useState('');
  const [editing, setEditing] = useState(null);
  const [tipoOptions, setTipoOptions] = useState([]);
  const [catalogError, setCatalogError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formResetKey, setFormResetKey] = useState(0);

  const adapter = useMemo(() => new EmpresaApiAdapter(), []);
  const getUsecase = useMemo(() => new GetEmpresas(adapter), [adapter]);
  const createUsecase = useMemo(() => new CreateEmpresa(adapter), [adapter]);
  const updateUsecase = useMemo(() => new UpdateEmpresa(adapter), [adapter]);
  const deleteUsecase = useMemo(() => new DeleteEmpresa(adapter), [adapter]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getUsecase.execute()
      .then(result => { if (mounted) setItems(result); })
      .catch(err => { if (mounted) setListError(err.message || err); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [getUsecase]);

  // fetch catálogo tipo contribuyente
  useEffect(() => {
    let mounted = true;
    adapter.getTipoContribuyenteCatalog()
      .then(data => { if (mounted) setTipoOptions(data); })
      .catch(err => { if (mounted) setCatalogError(err.message || err); });
    return () => { mounted = false; };
  }, [adapter]);

  const handleCreate = async (payload) => {
    setCreating(true);
    setFlash('');
    setFieldErrors({});
    try {
      const created = await createUsecase.execute(payload);
      setItems(prev => [created, ...(prev || [])]);
      setFlash('Empresa creada correctamente');
      setFormResetKey(k => k + 1);
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors(err.fieldErrors);
      } else {
        setListError(err.message || err);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (empresa) => {
    setEditing(empresa);
    setFlash('');
    setFieldErrors({});
  };

  const handleUpdate = async (payload) => {
    if (!editing?.id) {
      setListError('No hay empresa seleccionada');
      return;
    }
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const updated = await updateUsecase.execute(editing.id, payload);
      setItems(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      setFlash('Empresa actualizada');
      setEditing(null);
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors(err.fieldErrors);
      } else {
        setListError(err.message || err);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (empresa) => {
    if (!empresa?.id) {
      setListError('No hay empresa seleccionada');
      return;
    }
    const confirmed = window.confirm(`¿Eliminar empresa "${empresa.razonSocial}"?`);
    if (!confirmed) return;
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      await deleteUsecase.execute(empresa.id);
      setItems(prev => prev.filter(e => e.id !== empresa.id));
      setFlash('Empresa eliminada');
      if (editing?.id === empresa.id) setEditing(null);
    } catch (err) {
      setListError(err.message || err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="empresa-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Empresas</p>
          <h2>Catálogo de empresas</h2>
          <p className="muted">Crea la primera empresa para comenzar a trabajar.</p>
        </div>
        {flash && <span className="pill success">{flash}</span>}
        {catalogError && <span className="pill error">Catálogo: {String(catalogError)}</span>}
      </div>

      <div className="empresa-grid">
        <div className="panel-card">
          <EmpresaForm
            onCreate={editing ? handleUpdate : handleCreate}
            loading={creating || saving}
            initialData={editing}
            mode={editing ? 'edit' : 'create'}
            tipoOptions={tipoOptions}
            fieldErrors={fieldErrors}
            onCancel={() => setEditing(null)}
            resetKey={formResetKey}
          />
        </div>
        <div className="panel-card">
          <div className="panel-head">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="panel-title">Listado</span>
          </div>
          <EmpresaList
            items={items}
            loading={loading}
            error={listError}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
