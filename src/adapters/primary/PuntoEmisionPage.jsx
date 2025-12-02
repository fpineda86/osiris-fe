import React, { useEffect, useMemo, useState } from 'react';
import GetPuntosEmision from '../../domain/usecases/GetPuntosEmision.js';
import CreatePuntoEmision from '../../domain/usecases/CreatePuntoEmision.js';
import UpdatePuntoEmision from '../../domain/usecases/UpdatePuntoEmision.js';
import DeletePuntoEmision from '../../domain/usecases/DeletePuntoEmision.js';
import PuntoEmisionApiAdapter from '../secondary/PuntoEmisionApiAdapter.js';
import PuntoEmisionForm from '../../components/PuntoEmisionForm.jsx';
import PuntoEmisionList from '../../components/PuntoEmisionList.jsx';

export default function PuntoEmisionPage() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [listError, setListError] = useState('');
  const [empresaOptions, setEmpresaOptions] = useState([]);
  const [sucursalOptions, setSucursalOptions] = useState([]);
  const [formResetKey, setFormResetKey] = useState(0);

  const adapter = useMemo(() => new PuntoEmisionApiAdapter(), []);
  const getUsecase = useMemo(() => new GetPuntosEmision(adapter), [adapter]);
  const createUsecase = useMemo(() => new CreatePuntoEmision(adapter), [adapter]);
  const updateUsecase = useMemo(() => new UpdatePuntoEmision(adapter), [adapter]);
  const deleteUsecase = useMemo(() => new DeletePuntoEmision(adapter), [adapter]);
  const decoratedItems = useMemo(
    () => (items || []).map(p => ({
      ...p,
      empresaLabel: empresaOptions.find(opt => opt.value === p.empresaId)?.label || '',
      sucursalLabel: sucursalOptions.find(opt => opt.value === p.sucursalId)?.label || '',
    })),
    [items, empresaOptions, sucursalOptions],
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getUsecase.execute(), adapter.getEmpresaCatalog(), adapter.getSucursalCatalog()])
      .then(([puntos, empresas, sucursales]) => {
        if (!mounted) return;
        setItems(puntos);
        setEmpresaOptions(empresas);
        setSucursalOptions(sucursales);
      })
      .catch(err => { if (mounted) setListError(err.message || err); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [adapter, getUsecase]);

  const handleCreate = async (payload) => {
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const created = await createUsecase.execute(payload);
      setItems(prev => [created, ...(prev || [])]);
      setFlash('Punto de emision creado correctamente');
      setFormResetKey(k => k + 1);
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

  const handleEdit = (p) => {
    setEditing(p);
    setFieldErrors({});
    setFlash('');
  };

  const handleUpdate = async (payload) => {
    if (!editing?.id) {
      setListError('No hay punto de emision seleccionado');
      return;
    }
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const updated = await updateUsecase.execute(editing.id, payload);
      setItems(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      setFlash('Punto de emision actualizado');
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

  const handleDelete = async (p) => {
    if (!p?.id) {
      setListError('No hay punto de emision seleccionado');
      return;
    }
    const confirmed = window.confirm(`¿Eliminar punto de emision "${p.descripcion}"?`);
    if (!confirmed) return;
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      await deleteUsecase.execute(p.id);
      setItems(prev => prev.filter(e => e.id !== p.id));
      setFlash('Punto de emision eliminado');
      if (editing?.id === p.id) setEditing(null);
    } catch (err) {
      setListError(err.message || err);
    } finally {
      setSaving(false);
    }
  };

  const handleEmpresaChange = async (empresaId) => {
    try {
      const sucursales = await adapter.getSucursalCatalog(empresaId);
      setSucursalOptions(sucursales);
    } catch (err) {
      setListError(err.message || err);
    }
  };

  return (
    <div className="empresa-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Puntos de emision</p>
          <h2>Gestion de puntos de emision</h2>
          <p className="muted">Administra los puntos de emision asociados a empresa y sucursal.</p>
        </div>
        {flash && <span className="pill success">{flash}</span>}
        {listError && <span className="pill error">Error: {String(listError)}</span>}
      </div>

      <div className="empresa-grid">
        <div className="panel-card">
          <PuntoEmisionForm
            onSubmit={editing ? handleUpdate : handleCreate}
            loading={saving}
            initialData={editing}
            mode={editing ? 'edit' : 'create'}
            empresaOptions={empresaOptions}
            sucursalOptions={sucursalOptions}
            fieldErrors={fieldErrors}
            onCancel={() => setEditing(null)}
            onEmpresaChange={handleEmpresaChange}
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
          <PuntoEmisionList
            items={decoratedItems}
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
