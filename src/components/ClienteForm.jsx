import React, { useEffect, useState } from 'react';

const tipoIdentOptions = [
  { value: 'CEDULA', label: 'Cedula' },
  { value: 'RUC', label: 'RUC' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
];

export default function ClienteForm({
  onSubmit,
  loading,
  initialData = null,
  mode = 'create',
  tipoClienteOptions = [],
  fieldErrors = {},
  onCancel,
  onLookupIdentificacion,
  resetKey = 0,
}) {
  const [identificacion, setIdentificacion] = useState('');
  const [tipoIdentificacion, setTipoIdentificacion] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [email, setEmail] = useState('');
  const [tipoClienteId, setTipoClienteId] = useState('');
  const [localError, setLocalError] = useState(null);
  const [personaId, setPersonaId] = useState(null);
  const [lookupInfo, setLookupInfo] = useState('');

  const resetFields = (data = null) => {
    if (data) {
      setIdentificacion(data.identificacion || '');
      setTipoIdentificacion(data.tipoIdentificacion || '');
      setNombre(data.nombre || '');
      setApellido(data.apellido || '');
      setDireccion(data.direccion || '');
      setTelefono(data.telefono || '');
      setCiudad(data.ciudad || '');
      setEmail(data.email || '');
      setTipoClienteId(data.tipoClienteId || '');
      setPersonaId(data.personaId || null);
    } else {
      setIdentificacion('');
      setTipoIdentificacion('');
      setNombre('');
      setApellido('');
      setDireccion('');
      setTelefono('');
      setCiudad('');
      setEmail('');
      setTipoClienteId('');
      setPersonaId(null);
      setLookupInfo('');
    }
  };

  useEffect(() => {
    resetFields(initialData);
  }, [initialData, resetKey]);

  const handleLookup = async () => {
    if (!onLookupIdentificacion) return;
    const ident = identificacion.trim();
    if (!ident) return;
    setLookupInfo('');
    try {
      const persona = await onLookupIdentificacion(ident);
      if (persona) {
        setPersonaId(persona.id || null);
        setTipoIdentificacion(persona.tipo_identificacion || persona.tipoIdentificacion || '');
        setNombre(persona.nombre || '');
        setApellido(persona.apellido || '');
        setDireccion(persona.direccion || '');
        setTelefono(persona.telefono || '');
        setCiudad(persona.ciudad || '');
        setEmail(persona.email || '');
        setLookupInfo('Persona existente cargada y lista para reutilizar.');
      } else {
        setPersonaId(null);
      }
    } catch (err) {
      setLookupInfo('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!identificacion.trim()) { setLocalError('La identificacion es obligatoria'); return; }
    if (!tipoIdentificacion) { setLocalError('El tipo de identificacion es obligatorio'); return; }
    if (!nombre.trim()) { setLocalError('El nombre es obligatorio'); return; }
    if (!apellido.trim()) { setLocalError('El apellido es obligatorio'); return; }
    if (!tipoClienteId) { setLocalError('El tipo de cliente es obligatorio'); return; }

    await onSubmit({
      identificacion: identificacion.trim(),
      tipoIdentificacion,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      ciudad: ciudad.trim(),
      email: email.trim(),
      tipoClienteId,
      usuarioAuditoria: 'frontend',
      personaId,
    });
  };

  return (
    <form className="empresa-form" onSubmit={handleSubmit}>
      <div className="form-head">
        <div>
          <p className="eyebrow">Clientes</p>
          <h3>{mode === 'edit' ? 'Editar cliente' : 'Crear cliente'}</h3>
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
          <span>Identificacion *</span>
          <input
            name="identificacion"
            value={identificacion}
            onChange={e => setIdentificacion(e.target.value)}
            onBlur={handleLookup}
            placeholder="0102030405"
            required
          />
          {fieldErrors.identificacion && <p className="error-text">* {fieldErrors.identificacion}</p>}
        </label>
        <label>
          <span>Tipo identificacion *</span>
          <select
            name="tipoIdentificacion"
            value={tipoIdentificacion}
            onChange={e => setTipoIdentificacion(e.target.value)}
            required
          >
            <option value="">Selecciona tipo</option>
            {tipoIdentOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {fieldErrors.tipoIdentificacion && <p className="error-text">* {fieldErrors.tipoIdentificacion}</p>}
        </label>
        <label>
          <span>Nombre *</span>
          <input
            name="nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Juan"
            required
          />
          {fieldErrors.nombre && <p className="error-text">* {fieldErrors.nombre}</p>}
        </label>
        <label>
          <span>Apellido *</span>
          <input
            name="apellido"
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            placeholder="Perez"
            required
          />
          {fieldErrors.apellido && <p className="error-text">* {fieldErrors.apellido}</p>}
        </label>
        <label className="full">
          <span>Direccion</span>
          <input
            name="direccion"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            placeholder="Calle 123"
          />
          {fieldErrors.direccion && <p className="error-text">* {fieldErrors.direccion}</p>}
        </label>
        <label>
          <span>Telefono</span>
          <input
            name="telefono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            placeholder="0999999999"
          />
          {fieldErrors.telefono && <p className="error-text">* {fieldErrors.telefono}</p>}
        </label>
        <label>
          <span>Ciudad</span>
          <input
            name="ciudad"
            value={ciudad}
            onChange={e => setCiudad(e.target.value)}
            placeholder="Quito"
          />
          {fieldErrors.ciudad && <p className="error-text">* {fieldErrors.ciudad}</p>}
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
          {fieldErrors.email && <p className="error-text">* {fieldErrors.email}</p>}
        </label>
        <label>
          <span>Tipo de cliente *</span>
          <select
            name="tipoClienteId"
            value={tipoClienteId}
            onChange={e => setTipoClienteId(e.target.value)}
            required
          >
            <option value="">Selecciona un tipo</option>
            {tipoClienteOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {fieldErrors.tipoClienteId && <p className="error-text">* {fieldErrors.tipoClienteId}</p>}
        </label>
      </div>
      {lookupInfo && <p className="info-text">{lookupInfo}</p>}
      {localError && <p className="error-text">* {localError}</p>}
    </form>
  );
}
