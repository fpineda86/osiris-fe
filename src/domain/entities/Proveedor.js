/**
 * Entidad Proveedor con datos de persona y tipo de contribuyente.
 */
export default class Proveedor {
  constructor({
    id,
    personaId,
    nombreComercial,
    tipoContribuyenteId,
    tipoContribuyenteNombre,
    identificacion,
    tipoIdentificacion,
    nombre,
    apellido,
    direccion,
    telefono,
    ciudad,
    email,
    usuarioAuditoria,
    activo,
  } = {}) {
    this.id = id ?? null;
    this.personaId = personaId ?? null;
    this.nombreComercial = nombreComercial ?? '';
    this.tipoContribuyenteId = tipoContribuyenteId ?? '';
    this.tipoContribuyenteNombre = tipoContribuyenteNombre ?? '';
    this.identificacion = identificacion ?? '';
    this.tipoIdentificacion = tipoIdentificacion ?? '';
    this.nombre = nombre ?? '';
    this.apellido = apellido ?? '';
    this.direccion = direccion ?? '';
    this.telefono = telefono ?? '';
    this.ciudad = ciudad ?? '';
    this.email = email ?? '';
    this.usuarioAuditoria = usuarioAuditoria ?? '';
    this.activo = activo ?? true;
    Object.freeze(this);
  }
}
