/**
 * Caso de uso: lista sucursales activas.
 */
export default class GetSucursales {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getAll();
  }
}
