import React, { useEffect, useState } from 'react';

export default function TipoClienteForm({
  onSubmit,
  loading,
  initialData = null,
  mode = 'create',
  fieldErrors = {},
  onCancel,
  resetKey = 0,
}) {
  const [nombre, setNombre] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [localError, setLocalError] = useState(null);

  const resetFields = (data = null) => {
    if (data) {
      setNombre(data.nombre || '');
      setDescuento(data.descuento ?? 0);
    } else {
      setNombre('');
      setDescuento(0);
    }
  };

  useEffect(() => {
    resetFields(initialData);
  }, [initialData, resetKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!nombre.trim()) { setLocalError('El nombre es obligatorio'); return; }
    if (descuento === '' || descuento === null || Number.isNaN(Number(descuento))) {
      setLocalError('El descuento es obligatorio');
      return;
    }

    await onSubmit({
      nombre: nombre.trim(),
      descuento: Number(descuento),
      usuarioAuditoria: 'frontend',
    });
  };

  return (
    <form className="empresa-form" onSubmit={handleSubmit}>
      <div className="form-head">
        <div>
          <p className="eyebrow">Tipos de cliente</p>
          <h3>{mode === 'edit' ? 'Editar tipo de cliente' : 'Crear tipo de cliente'}</h3>
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
          <span>Nombre *</span>
          <input
            name="nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Minorista"
            required
          />
          {fieldErrors.nombre && <p className="error-text">* {fieldErrors.nombre}</p>}
        </label>
        <label>
          <span>Descuento (%)</span>
          <input
            type="number"
            name="descuento"
            value={descuento}
            onChange={e => setDescuento(e.target.value)}
            min={0}
          />
          {fieldErrors.descuento && <p className="error-text">* {fieldErrors.descuento}</p>}
        </label>
      </div>
      {localError && <p className="error-text">* {localError}</p>}
    </form>
  );
}
