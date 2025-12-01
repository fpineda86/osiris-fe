/**
 * Caso de uso: lista clientes.
 */
export default class GetClientes {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getAll();
  }
}
