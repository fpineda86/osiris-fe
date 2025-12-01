/**
 * Caso de uso: elimina (borra) una empresa.
 */
export default class DeleteEmpresa {
  /**
   * @param {EmpresaRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) throw new Error('El id es requerido');
    return this.repository.delete(id);
  }
}
