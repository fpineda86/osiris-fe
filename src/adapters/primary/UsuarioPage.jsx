import React, { useEffect, useMemo, useState } from 'react';
import GetUsuarios from '../../domain/usecases/GetUsuarios.js';
import CreateUsuario from '../../domain/usecases/CreateUsuario.js';
import UpdateUsuario from '../../domain/usecases/UpdateUsuario.js';
import DeleteUsuario from '../../domain/usecases/DeleteUsuario.js';
import UsuarioApiAdapter from '../secondary/UsuarioApiAdapter.js';
import UsuarioForm from '../../components/UsuarioForm.jsx';
import UsuarioList from '../../components/UsuarioList.jsx';

export default function UsuarioPage() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [listError, setListError] = useState('');
  const [rolOptions, setRolOptions] = useState([]);
  const [formResetKey, setFormResetKey] = useState(0);

  const adapter = useMemo(() => new UsuarioApiAdapter(), []);
  const getUsecase = useMemo(() => new GetUsuarios(adapter), [adapter]);
  const createUsecase = useMemo(() => new CreateUsuario(adapter), [adapter]);
  const updateUsecase = useMemo(() => new UpdateUsuario(adapter), [adapter]);
  const deleteUsecase = useMemo(() => new DeleteUsuario(adapter), [adapter]);

  const loadCatalogs = async () => {
    try {
      const roles = await adapter.getRolCatalog();
      setRolOptions(roles);
    } catch (err) {
      setListError(err.message || err);
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getUsecase.execute(), loadCatalogs()])
      .then(([usuarios]) => {
        if (!mounted) return;
        setItems(usuarios);
      })
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
      setFlash('Usuario creado correctamente');
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

  const handleEdit = (u) => {
    setEditing(u);
    setFieldErrors({});
    setFlash('');
  };

  const handleUpdate = async (payload) => {
    if (!editing?.id) {
      setListError('No hay usuario seleccionado');
      return;
    }
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const updated = await updateUsecase.execute(editing.id, { ...payload, id: editing.id });
      setItems(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      setFlash('Usuario actualizado');
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

  const handleDelete = async (u) => {
    if (!u?.id) {
      setListError('No hay usuario seleccionado');
      return;
    }
    const confirmed = window.confirm(`¿Eliminar usuario "${u.username}"?`);
    if (!confirmed) return;
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      await deleteUsecase.execute(u.id);
      setItems(prev => prev.filter(e => e.id !== u.id));
      setFlash('Usuario eliminado');
      if (editing?.id === u.id) setEditing(null);
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
          <p className="eyebrow">Seguridad</p>
          <h2>Usuarios</h2>
          <p className="muted">Gestiona usuarios, roles y datos de acceso.</p>
        </div>
        {flash && <span className="pill success">{flash}</span>}
        {listError && <span className="pill error">Error: {String(listError)}</span>}
      </div>

      <div className="empresa-grid">
        <div className="panel-card">
          <UsuarioForm
            onSubmit={editing ? handleUpdate : handleCreate}
            loading={saving}
            initialData={editing}
            mode={editing ? 'edit' : 'create'}
            rolOptions={rolOptions}
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
          <UsuarioList
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
