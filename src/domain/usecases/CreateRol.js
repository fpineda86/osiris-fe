/**
 * Caso de uso: crear rol.
 */
export default class CreateRol {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(payload) {
    if (!payload?.nombre) throw new Error('El nombre es requerido');
    if (!payload?.descripcion) throw new Error('La descripción es requerida');
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
    };
    return this.repository.create(normalized);
  }
}
