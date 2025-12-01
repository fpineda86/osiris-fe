import React, { useEffect, useMemo, useState } from 'react';
import GetRoles from '../../domain/usecases/GetRoles.js';
import CreateRol from '../../domain/usecases/CreateRol.js';
import UpdateRol from '../../domain/usecases/UpdateRol.js';
import DeleteRol from '../../domain/usecases/DeleteRol.js';
import RolApiAdapter from '../secondary/RolApiAdapter.js';
import RolForm from '../../components/RolForm.jsx';
import RolList from '../../components/RolList.jsx';

export default function RolPage() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [listError, setListError] = useState('');
  const [formResetKey, setFormResetKey] = useState(0);

  const adapter = useMemo(() => new RolApiAdapter(), []);
  const getUsecase = useMemo(() => new GetRoles(adapter), [adapter]);
  const createUsecase = useMemo(() => new CreateRol(adapter), [adapter]);
  const updateUsecase = useMemo(() => new UpdateRol(adapter), [adapter]);
  const deleteUsecase = useMemo(() => new DeleteRol(adapter), [adapter]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getUsecase.execute()
      .then(result => { if (mounted) setItems(result); })
      .catch(err => { if (mounted) setListError(err.message || err); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [getUsecase]);

  const handleCreate = async (payload) => {
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const created = await createUsecase.execute(payload);
      setItems(prev => [created, ...(prev || [])]);
      setFlash('Rol creado correctamente');
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

  const handleEdit = (r) => {
    setEditing(r);
    setFieldErrors({});
    setFlash('');
  };

  const handleUpdate = async (payload) => {
    if (!editing?.id) {
      setListError('No hay rol seleccionado');
      return;
    }
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const updated = await updateUsecase.execute(editing.id, payload);
      setItems(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      setFlash('Rol actualizado');
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

  const handleDelete = async (r) => {
    if (!r?.id) {
      setListError('No hay rol seleccionado');
      return;
    }
    const confirmed = window.confirm(`¿Eliminar rol "${r.nombre}"?`);
    if (!confirmed) return;
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      await deleteUsecase.execute(r.id);
      setItems(prev => prev.filter(e => e.id !== r.id));
      setFlash('Rol eliminado');
      if (editing?.id === r.id) setEditing(null);
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
          <p className="eyebrow">Seguridad</p>
          <h2>Roles</h2>
          <p className="muted">Gestiona los roles del sistema.</p>
        </div>
        {flash && <span className="pill success">{flash}</span>}
        {listError && <span className="pill error">Error: {String(listError)}</span>}
      </div>

      <div className="empresa-grid">
        <div className="panel-card">
          <RolForm
            onSubmit={editing ? handleUpdate : handleCreate}
            loading={saving}
            initialData={editing}
            mode={editing ? 'edit' : 'create'}
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
          <RolList
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
