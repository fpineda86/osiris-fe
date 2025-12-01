/**
 * Caso de uso: actualizar rol.
 */
export default class UpdateRol {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, payload) {
    if (!id) throw new Error('El id es requerido');
    if (!payload?.nombre) throw new Error('El nombre es requerido');
    if (!payload?.descripcion) throw new Error('La descripción es requerida');
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
    };
    return this.repository.update(id, normalized);
  }
}
