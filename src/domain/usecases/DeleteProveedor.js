/**
 * Caso de uso: eliminar proveedor.
 */
export default class DeleteProveedor {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) throw new Error('El id es requerido');
    return this.repository.delete(id);
  }
}
