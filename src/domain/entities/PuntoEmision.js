/**
 * Entidad Punto de Emisión.
 */
export default class PuntoEmision {
  constructor({
    id,
    codigo,
    descripcion,
    secuencialActual,
    usuarioAuditoria,
    empresaId,
    sucursalId,
    activo,
  } = {}) {
    this.id = id ?? null;
    this.codigo = codigo ?? '';
    this.descripcion = descripcion ?? '';
    this.secuencialActual = secuencialActual ?? 1;
    this.usuarioAuditoria = usuarioAuditoria ?? '';
    this.empresaId = empresaId ?? '';
    this.sucursalId = sucursalId ?? '';
    this.activo = activo ?? true;
    Object.freeze(this);
  }
}
