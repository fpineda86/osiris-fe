import React, { useState } from 'react';

export default function EmpresaForm({ onCreate, loading, initialData = null, mode = 'create', onCancel, tipoOptions = [], fieldErrors = {}, resetKey = 0 }) {
  const [razonSocial, setRazonSocial] = useState('');
  const [nombreComercial, setNombreComercial] = useState('');
  const [ruc, setRuc] = useState('');
  const [direccionMatriz, setDireccionMatriz] = useState('');
  const [telefono, setTelefono] = useState('');
  const [codigoEstablecimiento, setCodigoEstablecimiento] = useState('');
  const [obligadoContabilidad, setObligadoContabilidad] = useState(false);
  const [tipoContribuyenteId, setTipoContribuyenteId] = useState('');
  const [localError, setLocalError] = useState(null);

  const resetFields = (data = null) => {
    if (data) {
      setRazonSocial(data.razonSocial || '');
      setNombreComercial(data.nombreComercial || '');
      setRuc(data.ruc || '');
      setDireccionMatriz(data.direccionMatriz || '');
      setTelefono(data.telefono || '');
      setCodigoEstablecimiento(data.codigoEstablecimiento || '');
      setObligadoContabilidad(Boolean(data.obligadoContabilidad));
      setTipoContribuyenteId(data.tipoContribuyenteId || '');
    } else {
      setRazonSocial('');
      setNombreComercial('');
      setRuc('');
      setDireccionMatriz('');
      setTelefono('');
      setCodigoEstablecimiento('');
      setObligadoContabilidad(false);
      setTipoContribuyenteId('');
    }
  };

  // Hydrate when editing or reset
  React.useEffect(() => {
    resetFields(initialData);
  }, [initialData, resetKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!razonSocial.trim()) {
      setLocalError('La razón social es obligatoria');
      return;
    }
    if (!ruc.trim()) {
      setLocalError('El RUC es obligatorio');
      return;
    }
    if (!tipoContribuyenteId) {
      setLocalError('El tipo de contribuyente es obligatorio');
      return;
    }
    if (!codigoEstablecimiento.trim()) {
      setLocalError('El código de establecimiento es obligatorio');
      return;
    }
    await onCreate({
      razonSocial: razonSocial.trim(),
      nombreComercial: nombreComercial.trim(),
      ruc: ruc.trim(),
      direccionMatriz: direccionMatriz.trim(),
      telefono: telefono.trim(),
      codigoEstablecimiento: codigoEstablecimiento.trim(),
      obligadoContabilidad,
      tipoContribuyenteId: tipoContribuyenteId.trim(),
      activo: true,
    });
  };

  return (
    <form className="empresa-form" onSubmit={handleSubmit}>
      <div className="form-head">
        <div>
          <p className="eyebrow">Nueva empresa</p>
          <h3>Registrar empresa</h3>
        </div>
        <div className="form-actions">
          {mode === 'edit' && <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? (mode === 'edit' ? 'Guardando...' : 'Creando...') : (mode === 'edit' ? 'Guardar' : 'Crear')}
          </button>
        </div>
      </div>
      <div className="form-grid">
        <label className="full">
          <span>Razón social *</span>
          <input
            name="razonSocial"
            value={razonSocial}
            onChange={e => setRazonSocial(e.target.value)}
            placeholder="Open Latina S.A."
            required
          />
          {fieldErrors.razonSocial && <p className="error-text">* {fieldErrors.razonSocial}</p>}
        </label>
        <label className="full">
          <span>Nombre comercial</span>
          <input
            name="nombreComercial"
            value={nombreComercial}
            onChange={e => setNombreComercial(e.target.value)}
            placeholder="Open Latina"
          />
          {fieldErrors.nombreComercial && <p className="error-text">* {fieldErrors.nombreComercial}</p>}
        </label>
        <label>
          <span>RUC *</span>
          <input
            name="ruc"
            value={ruc}
            onChange={e => setRuc(e.target.value)}
            placeholder="8720367540295"
            required
            minLength={10}
            maxLength={20}
          />
          {fieldErrors.ruc && <p className="error-text">* {fieldErrors.ruc}</p>}
        </label>
        <label>
          <span>Teléfono</span>
          <input
            name="telefono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            placeholder="05673667"
          />
          {fieldErrors.telefono && <p className="error-text">* {fieldErrors.telefono}</p>}
        </label>
        <label className="full">
          <span>Dirección matriz</span>
          <input
            name="direccionMatriz"
            value={direccionMatriz}
            onChange={e => setDireccionMatriz(e.target.value)}
            placeholder="Av. Siempre Viva 123"
          />
          {fieldErrors.direccionMatriz && <p className="error-text">* {fieldErrors.direccionMatriz}</p>}
        </label>
        <label>
          <span>Código establecimiento</span>
          <input
            name="codigoEstablecimiento"
            value={codigoEstablecimiento}
            onChange={e => setCodigoEstablecimiento(e.target.value)}
            placeholder="408"
            required
          />
          {fieldErrors.codigoEstablecimiento && <p className="error-text">* {fieldErrors.codigoEstablecimiento}</p>}
        </label>
        <label>
          <span>Tipo de contribuyente</span>
          <select
            name="tipoContribuyenteId"
            value={tipoContribuyenteId}
            onChange={e => setTipoContribuyenteId(e.target.value)}
            required
          >
            <option value="">Selecciona un tipo</option>
            {tipoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {fieldErrors.tipoContribuyenteId && <p className="error-text">* {fieldErrors.tipoContribuyenteId}</p>}
        </label>
        <label>
          <span>Obligado a contabilidad</span>
          <div className="toggle">
            <input
              type="checkbox"
              checked={obligadoContabilidad}
              onChange={e => setObligadoContabilidad(e.target.checked)}
            />
            <span>{obligadoContabilidad ? 'Sí' : 'No'}</span>
          </div>
        </label>
      </div>
      {(localError) && <p className="muted error-text">{localError}</p>}
    </form>
  );
}
