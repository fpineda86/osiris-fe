import React, { useEffect, useMemo, useState } from 'react';
import GetProveedores from '../../domain/usecases/GetProveedores.js';
import CreateProveedor from '../../domain/usecases/CreateProveedor.js';
import UpdateProveedor from '../../domain/usecases/UpdateProveedor.js';
import DeleteProveedor from '../../domain/usecases/DeleteProveedor.js';
import ProveedorApiAdapter from '../secondary/ProveedorApiAdapter.js';
import ProveedorForm from '../../components/ProveedorForm.jsx';
import ProveedorList from '../../components/ProveedorList.jsx';

export default function ProveedorPage() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [listError, setListError] = useState('');
  const [tipoContribuyenteOptions, setTipoContribuyenteOptions] = useState([]);
  const [formResetKey, setFormResetKey] = useState(0);

  const adapter = useMemo(() => new ProveedorApiAdapter(), []);
  const getUsecase = useMemo(() => new GetProveedores(adapter), [adapter]);
  const createUsecase = useMemo(() => new CreateProveedor(adapter), [adapter]);
  const updateUsecase = useMemo(() => new UpdateProveedor(adapter), [adapter]);
  const deleteUsecase = useMemo(() => new DeleteProveedor(adapter), [adapter]);
  const decorate = (prov) => {
    const label = tipoContribuyenteOptions.find(opt => opt.value === prov.tipoContribuyenteId)?.label;
    return { ...prov, tipoContribuyenteNombre: prov.tipoContribuyenteNombre || label || prov.tipoContribuyenteId };
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getUsecase.execute(), adapter.getTipoContribuyenteCatalog()])
      .then(([proveedores, tipos]) => {
        if (!mounted) return;
        setTipoContribuyenteOptions(tipos);
        setItems(proveedores.map(p => ({ ...p, tipoContribuyenteNombre: p.tipoContribuyenteNombre || tipos.find(t => t.value === p.tipoContribuyenteId)?.label || p.tipoContribuyenteId })));
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
      const decorated = decorate(created);
      setItems(prev => [decorated, ...(prev || [])]);
      setFlash('Proveedor creado correctamente');
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
      setListError('No hay proveedor seleccionado');
      return;
    }
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      const updated = await updateUsecase.execute(editing.id, { ...payload, personaId: editing.personaId });
      const decorated = decorate(updated);
      setItems(prev => prev.map(e => (e.id === decorated.id ? decorated : e)));
      setFlash('Proveedor actualizado');
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
      setListError('No hay proveedor seleccionado');
      return;
    }
    const confirmed = window.confirm(`Eliminar proveedor "${p.nombreComercial}"?`);
    if (!confirmed) return;
    setSaving(true);
    setFlash('');
    setFieldErrors({});
    try {
      await deleteUsecase.execute(p.id);
      setItems(prev => prev.filter(e => e.id !== p.id));
      setFlash('Proveedor eliminado');
      if (editing?.id === p.id) setEditing(null);
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
          <p className="eyebrow">Proveedores</p>
          <h2>Gestión de proveedores</h2>
          <p className="muted">Registra proveedores y asigna su tipo de contribuyente.</p>
        </div>
        {flash && <span className="pill success">{flash}</span>}
        {listError && <span className="pill error">Error: {String(listError)}</span>}
      </div>

      <div className="empresa-grid">
        <div className="panel-card">
          <ProveedorForm
            onSubmit={editing ? handleUpdate : handleCreate}
            loading={saving}
            initialData={editing}
            mode={editing ? 'edit' : 'create'}
            tipoContribuyenteOptions={tipoContribuyenteOptions}
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
          <ProveedorList
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
