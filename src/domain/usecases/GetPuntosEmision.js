/**
 * Caso de uso: lista puntos de emisión activos.
 */
export default class GetPuntosEmision {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getAll();
  }
}
