/**
 * Entidad Usuario.
 */
export default class Usuario {
  constructor({
    id,
    personaId,
    rolId,
    username,
    requiereCambioPassword,
    activo,
    personaNombre,
    rolNombre,
  } = {}) {
    this.id = id ?? null;
    this.personaId = personaId ?? '';
    this.rolId = rolId ?? '';
    this.username = username ?? '';
    this.requiereCambioPassword = requiereCambioPassword ?? false;
    this.activo = activo ?? true;
    this.personaNombre = personaNombre ?? '';
    this.rolNombre = rolNombre ?? '';
    Object.freeze(this);
  }
}
