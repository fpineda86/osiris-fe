/**
 * Entidad Rol (seguridad).
 */
export default class Rol {
  constructor({
    id,
    nombre,
    descripcion,
    usuarioAuditoria,
  } = {}) {
    this.id = id ?? null;
    this.nombre = nombre ?? '';
    this.descripcion = descripcion ?? '';
    this.usuarioAuditoria = usuarioAuditoria ?? '';
    Object.freeze(this);
  }
}
