/**
 * Caso de uso: lista roles.
 */
export default class GetRoles {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getAll();
  }
}
