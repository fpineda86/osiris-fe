/**
 * Caso de uso: actualizar sucursal.
 */
export default class UpdateSucursal {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, payload) {
    if (!id) throw new Error('El id es requerido');
    if (!payload?.codigo) throw new Error('El código es requerido');
    if (!payload?.nombre) throw new Error('El nombre es requerido');
    if (!payload?.empresaId) throw new Error('La empresa es requerida');
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
    };
    return this.repository.update(id, normalized);
  }
}
