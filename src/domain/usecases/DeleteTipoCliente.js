/**
 * Caso de uso: eliminar tipo de cliente.
 */
export default class DeleteTipoCliente {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) throw new Error('El id es requerido');
    return this.repository.delete(id);
  }
}
