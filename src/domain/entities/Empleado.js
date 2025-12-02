/**
 * Entidad Empleado.
 */
export default class Empleado {
  constructor({
    id,
    personaId,
    personaIdentificacion,
    salario,
    fechaIngreso,
    fechaNacimiento,
    fechaSalida,
    username,
    rolId,
    personaNombre,
    rolNombre,
    activo,
  } = {}) {
    this.id = id ?? null;
    this.personaId = personaId ?? '';
    this.personaIdentificacion = personaIdentificacion ?? '';
    this.salario = salario ?? 0;
    this.fechaIngreso = fechaIngreso ?? '';
    this.fechaNacimiento = fechaNacimiento ?? '';
    this.fechaSalida = fechaSalida ?? '';
    this.username = username ?? '';
    this.rolId = rolId ?? '';
    this.personaNombre = personaNombre ?? '';
    this.rolNombre = rolNombre ?? '';
    this.activo = activo ?? true;
    Object.freeze(this);
  }
}
