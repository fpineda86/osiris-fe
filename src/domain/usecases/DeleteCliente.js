/**
 * Caso de uso: eliminar cliente.
 */
export default class DeleteCliente {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) throw new Error('El id es requerido');
    return this.repository.delete(id);
  }
}
