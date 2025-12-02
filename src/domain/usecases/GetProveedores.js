/**
 * Caso de uso: listar proveedores.
 */
export default class GetProveedores {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getAll();
  }
}
