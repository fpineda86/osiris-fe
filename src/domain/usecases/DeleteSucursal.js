/**
 * Caso de uso: eliminación lógica de sucursal (activo=false).
 */
export default class DeleteSucursal {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) throw new Error('El id es requerido');
    return this.repository.delete(id);
  }
}
