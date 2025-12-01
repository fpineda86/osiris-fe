/**
 * Entidad Tipo de Cliente.
 */
export default class TipoCliente {
  constructor({
    id,
    nombre,
    descuento,
    usuarioAuditoria,
  } = {}) {
    this.id = id ?? null;
    this.nombre = nombre ?? '';
    this.descuento = descuento ?? 0;
    this.usuarioAuditoria = usuarioAuditoria ?? '';
    Object.freeze(this);
  }
}
