import React, { useEffect, useState } from 'react';

export default function RolForm({
  onSubmit,
  loading,
  initialData = null,
  mode = 'create',
  fieldErrors = {},
  onCancel,
  resetKey = 0,
}) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [localError, setLocalError] = useState(null);

  const resetFields = (data = null) => {
    if (data) {
      setNombre(data.nombre || '');
      setDescripcion(data.descripcion || '');
    } else {
      setNombre('');
      setDescripcion('');
    }
  };

  useEffect(() => {
    resetFields(initialData);
  }, [initialData, resetKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!nombre.trim()) { setLocalError('El nombre es obligatorio'); return; }
    if (!descripcion.trim()) { setLocalError('La descripción es obligatoria'); return; }

    await onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      usuarioAuditoria: 'frontend',
    });
  };

  return (
    <form className="empresa-form" onSubmit={handleSubmit}>
      <div className="form-head">
        <div>
          <p className="eyebrow">Roles</p>
          <h3>{mode === 'edit' ? 'Editar rol' : 'Crear rol'}</h3>
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
            placeholder="Administrador"
            required
          />
          {fieldErrors.nombre && <p className="error-text">* {fieldErrors.nombre}</p>}
        </label>
        <label className="full">
          <span>Descripción *</span>
          <input
            name="descripcion"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Acceso total al sistema"
            required
          />
          {fieldErrors.descripcion && <p className="error-text">* {fieldErrors.descripcion}</p>}
        </label>
      </div>
      {localError && <p className="error-text">* {localError}</p>}
    </form>
  );
}
