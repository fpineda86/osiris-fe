import React, { useEffect, useState } from 'react';

const tipoIdentOptions = [
  { value: 'CEDULA', label: 'Cedula' },
  { value: 'RUC', label: 'RUC' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
];

export default function UsuarioForm({
  onSubmit,
  loading,
  initialData = null,
  mode = 'create',
  rolOptions = [],
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
  const [personaId, setPersonaId] = useState(null);
  const [rolId, setRolId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [lookupInfo, setLookupInfo] = useState('');

  const resetFields = (data = null) => {
    if (data) {
      setPersonaId(data.personaId || null);
      setIdentificacion(data.identificacion || '');
      setTipoIdentificacion(data.tipoIdentificacion || '');
      setNombre(data.nombre || '');
      setApellido(data.apellido || '');
      setDireccion(data.direccion || '');
      setTelefono(data.telefono || '');
      setCiudad(data.ciudad || '');
      setEmail(data.email || '');
      setRolId(data.rolId || '');
      setUsername(data.username || '');
      setPassword('');
      setRequiereCambioPassword(data.requiereCambioPassword ?? true);
      setLookupInfo('');
    } else {
      setPersonaId(null);
      setIdentificacion('');
      setTipoIdentificacion('');
      setNombre('');
      setApellido('');
      setDireccion('');
      setTelefono('');
      setCiudad('');
      setEmail('');
      setRolId('');
      setUsername('');
      setPassword('');
      setRequiereCambioPassword(true);
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
        setLookupInfo('Persona existente cargada para reutilizar/actualizar.');
      } else {
        setPersonaId(null);
      }
    } catch {
      setLookupInfo('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!rolId) { setLocalError('El rol es obligatorio'); return; }
    if (!username.trim()) { setLocalError('El usuario es obligatorio'); return; }
    if (mode === 'create' && !password.trim()) { setLocalError('La contraseña es obligatoria'); return; }
    if (!personaId) {
      if (!identificacion.trim()) { setLocalError('La identificacion es obligatoria'); return; }
      if (!tipoIdentificacion) { setLocalError('El tipo de identificacion es obligatorio'); return; }
      if (!nombre.trim()) { setLocalError('El nombre es obligatorio'); return; }
      if (!apellido.trim()) { setLocalError('El apellido es obligatorio'); return; }
    }

    await onSubmit({
      personaId,
      rolId,
      username: username.trim(),
      password: password.trim() || undefined,
      requiereCambioPassword,
      usuarioAuditoria: 'frontend',
      identificacion: identificacion.trim(),
      tipoIdentificacion,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      ciudad: ciudad.trim(),
      email: email.trim(),
    });
  };

  return (
    <form className="empresa-form" onSubmit={handleSubmit}>
      <div className="form-head">
        <div>
          <p className="eyebrow">Usuarios</p>
          <h3>{mode === 'edit' ? 'Editar usuario' : 'Crear usuario'}</h3>
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
          <span>Rol *</span>
          <select
            name="rolId"
            value={rolId}
            onChange={e => setRolId(e.target.value)}
            required
          >
            <option value="">Selecciona un rol</option>
            {rolOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {fieldErrors.rolId && <p className="error-text">* {fieldErrors.rolId}</p>}
        </label>
        <label>
          <span>Usuario *</span>
          <input
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="usuario"
            required
          />
          {fieldErrors.username && <p className="error-text">* {fieldErrors.username}</p>}
        </label>
        <label>
          <span>Contraseña {mode === 'create' ? '*' : '(deja en blanco para no cambiar)'}</span>
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={mode === 'create' ? '********' : '(sin cambio)'}
            required={mode === 'create'}
          />
          {fieldErrors.password && <p className="error-text">* {fieldErrors.password}</p>}
        </label>
        <label className="full">
          <span>Requiere cambio de contraseña</span>
          <div className="toggle">
            <input
              type="checkbox"
              checked={requiereCambioPassword}
              onChange={e => setRequiereCambioPassword(e.target.checked)}
            />
            <span>{requiereCambioPassword ? 'Si' : 'No'}</span>
          </div>
          {fieldErrors.requiereCambioPassword && <p className="error-text">* {fieldErrors.requiereCambioPassword}</p>}
        </label>
      </div>
      {lookupInfo && <p className="info-text">{lookupInfo}</p>}
      {localError && <p className="error-text">* {localError}</p>}
    </form>
  );
}
