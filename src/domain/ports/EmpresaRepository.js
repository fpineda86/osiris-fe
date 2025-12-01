/**
 * Puerto/contract que define lo que el dominio necesita para obtener empresas.
 * Implementaciones (adapters) deben proveer estos métodos.
 * Clase abstracta: los subclases deben implementar los métodos y lanzar si no.
 */
export default class EmpresaRepository {
  async getAll() {
    throw new Error('EmpresaRepository.getAll not implemented');
  }

  async create(_payload) {
    throw new Error('EmpresaRepository.create not implemented');
  }

  async update(_id, _payload) {
    throw new Error('EmpresaRepository.update not implemented');
  }

  async delete(_id) {
    throw new Error('EmpresaRepository.delete not implemented');
  }
}
