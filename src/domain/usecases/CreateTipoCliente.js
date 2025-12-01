/**
 * Caso de uso: crear tipo de cliente.
 */
export default class CreateTipoCliente {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(payload) {
    if (!payload?.nombre) throw new Error('El nombre es requerido');
    if (payload?.descuento === undefined || payload?.descuento === null) {
      throw new Error('El descuento es requerido');
    }
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
    };
    return this.repository.create(normalized);
  }
}
