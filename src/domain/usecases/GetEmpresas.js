/**
 * Caso de uso: obtiene la lista de empresas usando el puerto EmpresaRepository.
 * Sigue principio de Inversión de Dependencias: depende de la abstracción.
 */
export default class GetEmpresas {
  /**
   * @param {EmpresaRepository} repository - implementación del puerto
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Ejecuta el caso de uso y retorna una promesa con la lista de entidades Empresa.
   */
  async execute() {
    const raw = await this.repository.getAll();
    return raw;
  }
}