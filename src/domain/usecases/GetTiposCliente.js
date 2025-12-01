/**
 * Caso de uso: lista tipos de cliente.
 */
export default class GetTiposCliente {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getAll();
  }
}
