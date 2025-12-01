/**
 * Caso de uso: eliminación (lógica o hard) de punto de emisión.
 */
export default class DeletePuntoEmision {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    if (!id) throw new Error('El id es requerido');
    return this.repository.delete(id);
  }
}
