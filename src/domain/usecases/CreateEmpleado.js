/**
 * Crear empleado (crea/actualiza persona y usuario).
 */
export default class CreateEmpleado {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(payload) {
    if (!payload?.salario && payload?.salario !== 0) throw new Error('El salario es requerido');
    if (!payload?.fechaIngreso) throw new Error('La fecha de ingreso es requerida');
    if (!payload?.rolId) throw new Error('El rol es requerido');
    if (!payload?.username) throw new Error('El usuario es requerido');
    if (!payload?.password) throw new Error('La contraseña es requerida');
    if (!payload?.personaId) {
      if (!payload?.identificacion) throw new Error('La identificacion es requerida');
      if (!payload?.tipoIdentificacion) throw new Error('El tipo de identificacion es requerido');
      if (!payload?.nombre) throw new Error('El nombre es requerido');
      if (!payload?.apellido) throw new Error('El apellido es requerido');
    }
    const normalized = {
      ...payload,
      usuarioAuditoria: payload.usuarioAuditoria || 'frontend',
      activo: payload.activo ?? true,
    };
    return this.repository.create(normalized);
  }
}
