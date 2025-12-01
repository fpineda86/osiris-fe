/**
 * Entidad Empresa (modelo del dominio).
 * Representa la información relevante que usa la UI.
 */
export default class Empresa {
  constructor({
    id,
    razonSocial,
    nombreComercial,
    ruc,
    direccionMatriz,
    telefono,
    codigoEstablecimiento,
    obligadoContabilidad,
    tipoContribuyenteId,
    activo,
  } = {}) {
    this.id = id ?? null;
    this.razonSocial = razonSocial ?? '';
    this.nombreComercial = nombreComercial ?? '';
    this.ruc = ruc ?? '';
    this.direccionMatriz = direccionMatriz ?? '';
    this.telefono = telefono ?? '';
    this.codigoEstablecimiento = codigoEstablecimiento ?? '';
    this.obligadoContabilidad = obligadoContabilidad ?? false;
    this.tipoContribuyenteId = tipoContribuyenteId ?? '';
    this.activo = activo ?? true;
    Object.freeze(this); // inmutable por convención
  }
}
