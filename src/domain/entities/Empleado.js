/**
 * Entidad Empleado.
 */
export default class Empleado {
  constructor({
    id,
    personaId,
    personaIdentificacion,
    identificacion,
    tipoIdentificacion,
    nombre,
    apellido,
    direccion,
    telefono,
    ciudad,
    email,
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
    this.identificacion = identificacion ?? '';
    this.tipoIdentificacion = tipoIdentificacion ?? '';
    this.nombre = nombre ?? '';
    this.apellido = apellido ?? '';
    this.direccion = direccion ?? '';
    this.telefono = telefono ?? '';
    this.ciudad = ciudad ?? '';
    this.email = email ?? '';
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
