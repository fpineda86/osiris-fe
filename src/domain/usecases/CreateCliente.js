/**
 * Caso de uso: crear cliente (crea persona en backend).
 */
export default class CreateCliente {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(payload) {
    if (!payload?.identificacion) throw new Error('La identificacion es requerida');
    if (!payload?.tipoIdentificacion) throw new Error('El tipo de identificacion es requerido');
    if (!payload?.nombre) throw new Error('El nombre es requerido');
    if (!payload?.apellido) throw new Error('El apellido es requerido');
    if (!payload?.tipoClienteId) throw new Error('El tipo de cliente es requerido');
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
      activo: payload.activo ?? true,
    };
    return this.repository.create(normalized);
  }
}
