/**
 * Entidad Cliente que incluye datos de persona y tipo de cliente.
 */
export default class Cliente {
  constructor({
    id,
    personaId,
    tipoClienteId,
    tipoClienteNombre,
    identificacion,
    tipoIdentificacion,
    nombre,
    apellido,
    direccion,
    telefono,
    ciudad,
    email,
    usuarioAuditoria,
    activo,
  } = {}) {
    this.id = id ?? null;
    this.personaId = personaId ?? null;
    this.tipoClienteId = tipoClienteId ?? '';
    this.tipoClienteNombre = tipoClienteNombre ?? '';
    this.identificacion = identificacion ?? '';
    this.tipoIdentificacion = tipoIdentificacion ?? '';
    this.nombre = nombre ?? '';
    this.apellido = apellido ?? '';
    this.direccion = direccion ?? '';
    this.telefono = telefono ?? '';
    this.ciudad = ciudad ?? '';
    this.email = email ?? '';
    this.usuarioAuditoria = usuarioAuditoria ?? '';
    this.activo = activo ?? true;
    Object.freeze(this);
  }
}
