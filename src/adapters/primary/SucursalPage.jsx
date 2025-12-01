import React, { useEffect, useMemo, useState } from 'react';
import GetSucursales from '../../domain/usecases/GetSucursales.js';
import CreateSucursal from '../../domain/usecases/CreateSucursal.js';
import UpdateSucursal from '../../domain/usecases/UpdateSucursal.js';
import DeleteSucursal from '../../domain/usecases/DeleteSucursal.js';
import SucursalApiAdapter from '../secondary/SucursalApiAdapter.js';
import SucursalForm from '../../components/SucursalForm.jsx';
import SucursalList from '../../components/SucursalList.jsx';

export default function SucursalPage() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [listError, setListError] = useState('');
  const [empresaOptions, setEmpresaOptions] = useState([]);
  const [formResetKey, setFormResetKey] = useState(0);

  const adapter = useMemo(() => new SucursalApiAdapter(), []);
  const getUsecase = useMemo(() => new GetSucursales(adapter), [adapter]);
  const createUsecase = useMemo(() => new CreateSucursal(adapter), [adapter]);
  const updateUsecase = useMemo(() => new UpdateSucursal(adapter), [adapter]);
  const deleteUsecase = useMemo(() => new DeleteSucursal(adapter), [adapter]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getUsecase.execute(), adapter.getEmpresaCatalog()])
      .then(([sucursales, empresas]) => {
        if (!mounted) return;
        setItems(sucursales);
        setEmpresaOptions(empresas);
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
      setFlash('Sucursal creada correctamente');
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

  const handleEdit = (s) => {
    setEditing(s);
    setFieldErrors({});
    setFlash('');
  };

  const handleUpdate = async (payload) => {
    if (!editing?.id) {
      setListError('No hay sucursal seleccionada');
      return;
    }
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const updated = await updateUsecase.execute(editing.id, payload);
      setItems(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      setFlash('Sucursal actualizada');
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

  const handleDelete = async (s) => {
    if (!s?.id) {
      setListError('No hay sucursal seleccionada');
      return;
    }
    const confirmed = window.confirm(`¿Eliminar sucursal "${s.nombre}"?`);
    if (!confirmed) return;
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      await deleteUsecase.execute(s.id);
      setItems(prev => prev.filter(e => e.id !== s.id));
      setFlash('Sucursal eliminada');
      if (editing?.id === s.id) setEditing(null);
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
          <p className="eyebrow">Sucursales</p>
          <h2>Gestión de sucursales</h2>
          <p className="muted">Crea y administra las sucursales asociadas a tus empresas.</p>
        </div>
        {flash && <span className="pill success">{flash}</span>}
        {listError && <span className="pill error">Error: {String(listError)}</span>}
      </div>

      <div className="empresa-grid">
        <div className="panel-card">
          <SucursalForm
            onSubmit={editing ? handleUpdate : handleCreate}
            loading={saving}
            initialData={editing}
            mode={editing ? 'edit' : 'create'}
            empresaOptions={empresaOptions}
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
          <SucursalList
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
