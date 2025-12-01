import React, { useEffect, useState } from 'react';

export default function PuntoEmisionForm({
  onSubmit,
  loading,
  initialData = null,
  mode = 'create',
  empresaOptions = [],
  sucursalOptions = [],
  fieldErrors = {},
  onCancel,
  onEmpresaChange,
  resetKey = 0,
}) {
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [secuencialActual, setSecuencialActual] = useState(1);
  const [empresaId, setEmpresaId] = useState('');
  const [sucursalId, setSucursalId] = useState('');
  const [localError, setLocalError] = useState(null);

  const resetFields = (data = null) => {
    if (data) {
      setCodigo(data.codigo || '');
      setDescripcion(data.descripcion || '');
      setSecuencialActual(data.secuencialActual ?? 1);
      setEmpresaId(data.empresaId || '');
      setSucursalId(data.sucursalId || '');
    } else {
      setCodigo('');
      setDescripcion('');
      setSecuencialActual(1);
      setEmpresaId('');
      setSucursalId('');
    }
  };

  useEffect(() => {
    resetFields(initialData);
  }, [initialData, resetKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!codigo.trim()) { setLocalError('El código es obligatorio'); return; }
    if (!descripcion.trim()) { setLocalError('La descripción es obligatoria'); return; }
    if (secuencialActual === '' || secuencialActual === null || Number.isNaN(Number(secuencialActual))) {
      setLocalError('El secuencial actual es obligatorio');
      return;
    }
    if (!empresaId) { setLocalError('La empresa es obligatoria'); return; }
    if (!sucursalId) { setLocalError('La sucursal es obligatoria'); return; }

    await onSubmit({
      codigo: codigo.trim(),
      descripcion: descripcion.trim(),
      secuencialActual: Number(secuencialActual),
      empresaId,
      sucursalId,
      usuarioAuditoria: 'frontend',
      activo: true,
    });
  };

  const handleEmpresaChange = (value) => {
    setEmpresaId(value);
    setSucursalId(''); // reset dependent
    if (onEmpresaChange) onEmpresaChange(value);
  };

  return (
    <form className="empresa-form" onSubmit={handleSubmit}>
      <div className="form-head">
        <div>
          <p className="eyebrow">Nuevo punto de emisión</p>
          <h3>{mode === 'edit' ? 'Editar punto de emisión' : 'Registrar punto de emisión'}</h3>
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
            placeholder="001"
            required
          />
          {fieldErrors.codigo && <p className="error-text">* {fieldErrors.codigo}</p>}
        </label>
        <label className="full">
          <span>Descripción *</span>
          <input
            name="descripcion"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Caja Matriz"
            required
          />
          {fieldErrors.descripcion && <p className="error-text">* {fieldErrors.descripcion}</p>}
        </label>
        <label>
          <span>Secuencial actual *</span>
          <input
            type="number"
            name="secuencialActual"
            value={secuencialActual}
            onChange={e => setSecuencialActual(e.target.value)}
            min={0}
            required
          />
          {fieldErrors.secuencialActual && <p className="error-text">* {fieldErrors.secuencialActual}</p>}
        </label>
        <label>
          <span>Empresa *</span>
          <select
            name="empresaId"
            value={empresaId}
            onChange={e => handleEmpresaChange(e.target.value)}
            required
          >
            <option value="">Selecciona una empresa</option>
            {empresaOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {fieldErrors.empresaId && <p className="error-text">* {fieldErrors.empresaId}</p>}
        </label>
        <label>
          <span>Sucursal *</span>
          <select
            name="sucursalId"
            value={sucursalId}
            onChange={e => setSucursalId(e.target.value)}
            required
          >
            <option value="">Selecciona una sucursal</option>
            {sucursalOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {fieldErrors.sucursalId && <p className="error-text">* {fieldErrors.sucursalId}</p>}
        </label>
      </div>
      {localError && <p className="error-text">* {localError}</p>}
    </form>
  );
}
