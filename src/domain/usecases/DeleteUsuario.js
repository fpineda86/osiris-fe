/**
 * Eliminar (lógico) usuario.
 */
export default class DeleteUsuario {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) throw new Error('El id es requerido');
    return this.repository.delete(id);
  }
}
