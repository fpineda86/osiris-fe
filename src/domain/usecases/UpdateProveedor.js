/**
 * Caso de uso: actualizar proveedor/persona.
 */
export default class UpdateProveedor {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, payload) {
    if (!id) throw new Error('El id es requerido');
    if (!payload?.identificacion) throw new Error('La identificacion es requerida');
    if (!payload?.tipoIdentificacion) throw new Error('El tipo de identificacion es requerido');
    if (!payload?.nombre) throw new Error('El nombre es requerido');
    if (!payload?.apellido) throw new Error('El apellido es requerido');
    if (!payload?.tipoContribuyenteId) throw new Error('El tipo de contribuyente es requerido');

    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
    };
    return this.repository.update(id, normalized);
  }
}
