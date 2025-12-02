/**
 * Obtener lista de empleados.
 */
export default class GetEmpleados {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getAll();
  }
}
