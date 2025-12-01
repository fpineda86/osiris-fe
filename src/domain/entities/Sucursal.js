/**
 * Entidad Sucursal.
 */
export default class Sucursal {
  constructor({
    id,
    codigo,
    nombre,
    direccion,
    telefono,
    usuarioAuditoria,
    empresaId,
    activo,
  } = {}) {
    this.id = id ?? null;
    this.codigo = codigo ?? '';
    this.nombre = nombre ?? '';
    this.direccion = direccion ?? '';
    this.telefono = telefono ?? '';
    this.usuarioAuditoria = usuarioAuditoria ?? '';
    this.empresaId = empresaId ?? '';
    this.activo = activo ?? true;
    Object.freeze(this);
  }
}
