import React, { useEffect, useState } from 'react';

export default function SucursalForm({
  onSubmit,
  loading,
  initialData = null,
  mode = 'create',
  empresaOptions = [],
  fieldErrors = {},
  onCancel,
  resetKey = 0,
}) {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresaId, setEmpresaId] = useState('');
  const [obligadoContabilidad] = useState(false); // placeholder to mirror pattern
  const [localError, setLocalError] = useState(null);

  const resetFields = (data = null) => {
    if (data) {
      setCodigo(data.codigo || '');
      setNombre(data.nombre || '');
      setDireccion(data.direccion || '');
      setTelefono(data.telefono || '');
      setEmpresaId(data.empresaId || '');
    } else {
      setCodigo('');
      setNombre('');
      setDireccion('');
      setTelefono('');
      setEmpresaId('');
    }
  };

  useEffect(() => {
    resetFields(initialData);
  }, [initialData, resetKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!codigo.trim()) {
      setLocalError('El código es obligatorio');
      return;
    }
    if (!nombre.trim()) {
      setLocalError('El nombre es obligatorio');
      return;
    }
    if (!empresaId) {
      setLocalError('Debe seleccionar una empresa');
      return;
    }

    await onSubmit({
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      empresaId,
      usuarioAuditoria: 'frontend',
      activo: true,
    });
  };

  return (
    <form className="empresa-form" onSubmit={handleSubmit}>
      <div className="form-head">
        <div>
          <p className="eyebrow">Nueva sucursal</p>
          <h3>{mode === 'edit' ? 'Editar sucursal' : 'Registrar sucursal'}</h3>
        </div>
        <div className="form-actions">
          {mode === 'edit' && <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? (mode === 'edit' ? 'Guardando...' : 'Creando...') : (mode === 'edit' ? 'Guardar' : 'Crear')}
          </button>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>Código *</span>
          <input
            name="codigo"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder="SUC01"
            required
          />
          {fieldErrors.codigo && <p className="error-text">* {fieldErrors.codigo}</p>}
        </label>
        <label>
          <span>Nombre *</span>
          <input
            name="nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Sucursal Quito"
            required
          />
          {fieldErrors.nombre && <p className="error-text">* {fieldErrors.nombre}</p>}
        </label>
        <label className="full">
          <span>Dirección</span>
          <input
            name="direccion"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            placeholder="Av. Principal 123"
          />
          {fieldErrors.direccion && <p className="error-text">* {fieldErrors.direccion}</p>}
        </label>
        <label>
          <span>Teléfono</span>
          <input
            name="telefono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            placeholder="13555508"
          />
          {fieldErrors.telefono && <p className="error-text">* {fieldErrors.telefono}</p>}
        </label>
        <label>
          <span>Empresa *</span>
          <select
            name="empresaId"
            value={empresaId}
            onChange={e => setEmpresaId(e.target.value)}
            required
          >
            <option value="">Selecciona una empresa</option>
            {empresaOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {fieldErrors.empresaId && <p className="error-text">* {fieldErrors.empresaId}</p>}
        </label>
      </div>
      {localError && <p className="error-text">* {localError}</p>}
    </form>
  );
}
