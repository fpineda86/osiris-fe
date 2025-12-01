/**
 * Caso de uso: crea una empresa usando el puerto EmpresaRepository.
 */
export default class CreateEmpresa {
  /**
   * @param {EmpresaRepository} repository - implementación del puerto
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * @param {{
   *  razonSocial: string,
   *  nombreComercial?: string,
   *  ruc: string,
   *  direccionMatriz?: string,
   *  telefono?: string,
   *  codigoEstablecimiento?: string,
   *  obligadoContabilidad?: boolean,
   *  tipoContribuyenteId?: string,
   *  activo?: boolean,
   * }} payload
   */
  async execute(payload) {
    if (!payload?.razonSocial) {
      throw new Error('La razón social es requerida');
    }
    if (!payload?.ruc) {
      throw new Error('El RUC es requerido');
    }
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
      activo: payload.activo ?? true,
    };
    return this.repository.create(normalized);
  }
}
