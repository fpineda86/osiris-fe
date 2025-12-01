/**
 * Caso de uso: actualizar tipo de cliente.
 */
export default class UpdateTipoCliente {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, payload) {
    if (!id) throw new Error('El id es requerido');
    if (!payload?.nombre) throw new Error('El nombre es requerido');
    if (payload?.descuento === undefined || payload?.descuento === null) {
      throw new Error('El descuento es requerido');
    }
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
    };
    return this.repository.update(id, normalized);
  }
}
