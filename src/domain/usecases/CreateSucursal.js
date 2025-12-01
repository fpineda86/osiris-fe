/**
 * Caso de uso: crear sucursal.
 */
export default class CreateSucursal {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(payload) {
    if (!payload?.codigo) throw new Error('El código es requerido');
    if (!payload?.nombre) throw new Error('El nombre es requerido');
    if (!payload?.empresaId) throw new Error('La empresa es requerida');
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
      activo: payload.activo ?? true,
    };
    return this.repository.create(normalized);
  }
}
