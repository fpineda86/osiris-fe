/**
 * Puerto para Clientes (contrato del dominio).
 */
export default class ClienteRepository {
  async getAll() {
    throw new Error('ClienteRepository.getAll not implemented');
  }

  async create(_payload) {
    throw new Error('ClienteRepository.create not implemented');
  }

  async update(_id, _payload) {
    throw new Error('ClienteRepository.update not implemented');
  }

  async delete(_id) {
    throw new Error('ClienteRepository.delete not implemented');
  }
}
