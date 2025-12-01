/**
 * Obtener lista de usuarios.
 */
export default class GetUsuarios {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getAll();
  }
}
