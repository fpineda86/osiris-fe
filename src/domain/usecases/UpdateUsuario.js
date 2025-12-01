/**
 * Actualizar usuario.
 */
export default class UpdateUsuario {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, payload) {
    if (!id) throw new Error('El id es requerido');
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
    };
    return this.repository.update(id, normalized);
  }
}
