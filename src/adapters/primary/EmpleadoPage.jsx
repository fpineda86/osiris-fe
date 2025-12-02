import React, { useEffect, useMemo, useState } from 'react';
import GetEmpleados from '../../domain/usecases/GetEmpleados.js';
import CreateEmpleado from '../../domain/usecases/CreateEmpleado.js';
import UpdateEmpleado from '../../domain/usecases/UpdateEmpleado.js';
import DeleteEmpleado from '../../domain/usecases/DeleteEmpleado.js';
import EmpleadoApiAdapter from '../secondary/EmpleadoApiAdapter.js';
import EmpleadoForm from '../../components/EmpleadoForm.jsx';
import EmpleadoList from '../../components/EmpleadoList.jsx';

export default function EmpleadoPage() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [listError, setListError] = useState('');
  const [rolOptions, setRolOptions] = useState([]);
  const [formResetKey, setFormResetKey] = useState(0);

  const adapter = useMemo(() => new EmpleadoApiAdapter(), []);
  const getUsecase = useMemo(() => new GetEmpleados(adapter), [adapter]);
  const createUsecase = useMemo(() => new CreateEmpleado(adapter), [adapter]);
  const updateUsecase = useMemo(() => new UpdateEmpleado(adapter), [adapter]);
  const deleteUsecase = useMemo(() => new DeleteEmpleado(adapter), [adapter]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getUsecase.execute(), adapter.getRolCatalog()])
      .then(([empleados, roles]) => {
        if (!mounted) return;
        setItems(empleados);
        setRolOptions(roles);
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
      setFlash('Empleado creado correctamente');
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

  const handleEdit = (e) => {
    setEditing(e);
    setFieldErrors({});
    setFlash('');
  };

  const handleUpdate = async (payload) => {
    if (!editing?.id) {
      setListError('No hay empleado seleccionado');
      return;
    }
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const updated = await updateUsecase.execute(editing.id, { ...payload, personaId: editing.personaId });
      setItems(prev => prev.map(emp => (emp.id === updated.id ? updated : emp)));
      setFlash('Empleado actualizado');
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

  const handleDelete = async (e) => {
    if (!e?.id) {
      setListError('No hay empleado seleccionado');
      return;
    }
    const confirmed = window.confirm(`¿Eliminar empleado "${e.personaNombre || e.username}"?`);
    if (!confirmed) return;
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      await deleteUsecase.execute(e.id);
      setItems(prev => prev.filter(emp => emp.id !== e.id));
      setFlash('Empleado eliminado');
      if (editing?.id === e.id) setEditing(null);
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
          <p className="eyebrow">Talento Humano</p>
          <h2>Empleados</h2>
          <p className="muted">Crea empleados, asigna rol y credenciales (crea/actualiza persona).</p>
        </div>
        {flash && <span className="pill success">{flash}</span>}
        {listError && <span className="pill error">Error: {String(listError)}</span>}
      </div>

      <div className="empresa-grid">
        <div className="panel-card">
          <EmpleadoForm
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
          <EmpleadoList
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
