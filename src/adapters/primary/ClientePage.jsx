import React, { useEffect, useMemo, useState } from 'react';
import GetClientes from '../../domain/usecases/GetClientes.js';
import CreateCliente from '../../domain/usecases/CreateCliente.js';
import UpdateCliente from '../../domain/usecases/UpdateCliente.js';
import DeleteCliente from '../../domain/usecases/DeleteCliente.js';
import ClienteApiAdapter from '../secondary/ClienteApiAdapter.js';
import ClienteForm from '../../components/ClienteForm.jsx';
import ClienteList from '../../components/ClienteList.jsx';

export default function ClientePage() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [listError, setListError] = useState('');
  const [tipoClienteOptions, setTipoClienteOptions] = useState([]);
  const [formResetKey, setFormResetKey] = useState(0);

  const adapter = useMemo(() => new ClienteApiAdapter(), []);
  const getUsecase = useMemo(() => new GetClientes(adapter), [adapter]);
  const createUsecase = useMemo(() => new CreateCliente(adapter), [adapter]);
  const updateUsecase = useMemo(() => new UpdateCliente(adapter), [adapter]);
  const deleteUsecase = useMemo(() => new DeleteCliente(adapter), [adapter]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getUsecase.execute(), adapter.getTipoClienteCatalog()])
      .then(([clientes, tipos]) => {
        if (!mounted) return;
        setItems(clientes);
        setTipoClienteOptions(tipos);
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
      setFlash('Cliente creado correctamente');
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

  const handleEdit = (c) => {
    setEditing(c);
    setFieldErrors({});
    setFlash('');
  };

  const handleUpdate = async (payload) => {
    if (!editing?.id) {
      setListError('No hay cliente seleccionado');
      return;
    }
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const updated = await updateUsecase.execute(editing.id, { ...payload, personaId: editing.personaId });
      setItems(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      setFlash('Cliente actualizado');
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

  const handleDelete = async (c) => {
    if (!c?.id) {
      setListError('No hay cliente seleccionado');
      return;
    }
    const confirmed = window.confirm(`¿Eliminar cliente "${c.nombre} ${c.apellido}"?`);
    if (!confirmed) return;
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      await deleteUsecase.execute(c.id);
      setItems(prev => prev.filter(e => e.id !== c.id));
      setFlash('Cliente eliminado');
      if (editing?.id === c.id) setEditing(null);
    } catch (err) {
      setListError(err.message || err);
    } finally {
      setSaving(false);
    }
  };

  const handleLookupPersona = async (ident) => {
    try {
      return await adapter.findPersonaByIdentificacion(ident);
    } catch (err) {
      setListError(err.message || err);
      return null;
    }
  };

  return (
    <div className="empresa-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Clientes</p>
          <h2>Gestión de clientes</h2>
          <p className="muted">Crea y administra clientes.</p>
        </div>
        {flash && <span className="pill success">{flash}</span>}
        {listError && <span className="pill error">Error: {String(listError)}</span>}
      </div>

      <div className="empresa-grid">
        <div className="panel-card">
          <ClienteForm
            onSubmit={editing ? handleUpdate : handleCreate}
            loading={saving}
            initialData={editing}
            mode={editing ? 'edit' : 'create'}
            tipoClienteOptions={tipoClienteOptions}
            fieldErrors={fieldErrors}
            onCancel={() => setEditing(null)}
            onLookupIdentificacion={handleLookupPersona}
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
          <ClienteList
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
