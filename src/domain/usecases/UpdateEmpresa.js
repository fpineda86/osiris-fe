/**
 * Caso de uso: actualiza una empresa.
 */
export default class UpdateEmpresa {
  /**
   * @param {EmpresaRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, payload) {
    if (!id) throw new Error('El id es requerido');
    if (!payload?.razonSocial) throw new Error('La razón social es requerida');
    if (!payload?.ruc) throw new Error('El RUC es requerido');
    return this.repository.update(id, payload);
  }
}
