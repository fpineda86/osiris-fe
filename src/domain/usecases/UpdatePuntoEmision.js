/**
 * Caso de uso: actualizar punto de emisión.
 */
export default class UpdatePuntoEmision {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, payload) {
    if (!id) throw new Error('El id es requerido');
    if (!payload?.codigo) throw new Error('El código es requerido');
    if (!payload?.descripcion) throw new Error('La descripción es requerida');
    if (payload?.secuencialActual === undefined || payload?.secuencialActual === null) {
      throw new Error('El secuencial actual es requerido');
    }
    if (!payload?.empresaId) throw new Error('La empresa es requerida');
    if (!payload?.sucursalId) throw new Error('La sucursal es requerida');
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
    };
    return this.repository.update(id, normalized);
  }
}
