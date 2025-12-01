import React, { useEffect, useMemo, useState } from 'react';
import GetTiposCliente from '../../domain/usecases/GetTiposCliente.js';
import CreateTipoCliente from '../../domain/usecases/CreateTipoCliente.js';
import UpdateTipoCliente from '../../domain/usecases/UpdateTipoCliente.js';
import DeleteTipoCliente from '../../domain/usecases/DeleteTipoCliente.js';
import TipoClienteApiAdapter from '../secondary/TipoClienteApiAdapter.js';
import TipoClienteForm from '../../components/TipoClienteForm.jsx';
import TipoClienteList from '../../components/TipoClienteList.jsx';

export default function TipoClientePage() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [listError, setListError] = useState('');
  const [formResetKey, setFormResetKey] = useState(0);

  const adapter = useMemo(() => new TipoClienteApiAdapter(), []);
  const getUsecase = useMemo(() => new GetTiposCliente(adapter), [adapter]);
  const createUsecase = useMemo(() => new CreateTipoCliente(adapter), [adapter]);
  const updateUsecase = useMemo(() => new UpdateTipoCliente(adapter), [adapter]);
  const deleteUsecase = useMemo(() => new DeleteTipoCliente(adapter), [adapter]);

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
      setFlash('Tipo de cliente creado correctamente');
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

  const handleEdit = (t) => {
    setEditing(t);
    setFieldErrors({});
    setFlash('');
  };

  const handleUpdate = async (payload) => {
    if (!editing?.id) {
      setListError('No hay tipo de cliente seleccionado');
      return;
    }
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const updated = await updateUsecase.execute(editing.id, payload);
      setItems(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      setFlash('Tipo de cliente actualizado');
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

  const handleDelete = async (t) => {
    if (!t?.id) {
      setListError('No hay tipo de cliente seleccionado');
      return;
    }
    const confirmed = window.confirm(`¿Eliminar tipo de cliente "${t.nombre}"?`);
    if (!confirmed) return;
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      await deleteUsecase.execute(t.id);
      setItems(prev => prev.filter(e => e.id !== t.id));
      setFlash('Tipo de cliente eliminado');
      if (editing?.id === t.id) setEditing(null);
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
          <p className="eyebrow">Clientes</p>
          <h2>Tipos de cliente</h2>
          <p className="muted">Define los tipos de cliente y descuentos asociados.</p>
        </div>
        {flash && <span className="pill success">{flash}</span>}
        {listError && <span className="pill error">Error: {String(listError)}</span>}
      </div>

      <div className="empresa-grid">
        <div className="panel-card">
          <TipoClienteForm
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
          <TipoClienteList
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
