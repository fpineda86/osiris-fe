/**
 * Eliminar (lógico) empleado.
 */
export default class DeleteEmpleado {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) throw new Error('El id es requerido');
    return this.repository.delete(id);
  }
}
