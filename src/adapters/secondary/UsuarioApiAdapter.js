/**
 * Adapter para Usuarios.
 */
import api from '../../api/client.js';
import Usuario from '../../domain/entities/Usuario.js';
import UsuarioRepository from '../../domain/ports/UsuarioRepository.js';

const PERSONA_ENDPOINT = '/api/personas';

export default class UsuarioApiAdapter extends UsuarioRepository {
  sanitize(obj) {
    const out = {};
    Object.entries(obj || {}).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (typeof v === 'string' && v.trim() === '') return;
      out[k] = v;
    });
    return out;
  }

  mapEntity(item, fallback = {}) {
    return new Usuario({
      id: item.id ?? fallback.id,
      personaId: item.persona_id ?? item.personaId ?? fallback.personaId,
      rolId: item.rol_id ?? item.rolId ?? fallback.rolId,
      username: item.username ?? fallback.username,
      requiereCambioPassword: item.requiere_cambio_password ?? item.requiereCambioPassword ?? fallback.requiereCambioPassword,
      activo: item.activo ?? fallback.activo ?? true,
      personaNombre: item.persona?.nombre
        ? `${item.persona.nombre || ''} ${item.persona.apellido || ''}`.trim()
        : fallback.personaNombre || '',
      rolNombre: item.rol?.nombre || fallback.rolNombre || '',
    });
  }

  normalizeError(error) {
    const detail = error?.response?.data?.detail;
    const fieldErrors = {};
    let message = error?.message || 'Error desconocido';
    if (Array.isArray(detail)) {
      message = detail.map(d => d.msg || JSON.stringify(d)).join(' / ');
      detail.forEach(d => {
        if (Array.isArray(d.loc)) {
          const key = d.loc[d.loc.length - 1];
          const map = {
            persona_id: 'personaId',
            rol_id: 'rolId',
            username: 'username',
            password: 'password',
            requiere_cambio_password: 'requiereCambioPassword',
          };
          const mapped = map[key] || key;
          fieldErrors[mapped] = d.msg || String(d);
        }
      });
    } else if (detail) {
      message = typeof detail === 'string' ? detail : JSON.stringify(detail);
    }
    const err = new Error(message);
    err.fieldErrors = fieldErrors;
    return err;
  }

  async getAll() {
    const res = await api.get('/api/usuarios');
    const data = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    const activeOnly = data.filter(u => u.activo !== false);
    return activeOnly.map(u => this.mapEntity(u));
  }

  async create(payload) {
    const personaPayload = this.sanitize({
      id: payload.personaId,
      identificacion: payload.identificacion,
      tipo_identificacion: payload.tipoIdentificacion,
      nombre: payload.nombre,
      apellido: payload.apellido,
      direccion: payload.direccion,
      telefono: payload.telefono,
      ciudad: payload.ciudad,
      email: payload.email,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
      activo: payload.activo ?? true,
    });

    let personaId = payload.personaId ?? null;
    try {
      if (personaId) {
        await api.put(`${PERSONA_ENDPOINT}/${personaId}`, personaPayload);
      } else {
        const createdPersona = await api.post(PERSONA_ENDPOINT, personaPayload);
        personaId = createdPersona.data?.id;
      }
    } catch (error) {
      throw this.normalizeError(error);
    }

    const apiPayload = this.sanitize({
      persona_id: personaId,
      rol_id: payload.rolId,
      username: payload.username,
      password: payload.password,
      requiere_cambio_password: payload.requiereCambioPassword ?? true,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    });
    let res;
    try {
      res = await api.post('/api/usuarios', apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || { ...payload, personaId };
    const personaNombre = `${payload.nombre || ''} ${payload.apellido || ''}`.trim();
    return this.mapEntity(item, { ...payload, personaId, personaNombre });
  }

  async update(id, payload) {
    const personaPayload = this.sanitize({
      id: payload.personaId,
      identificacion: payload.identificacion,
      tipo_identificacion: payload.tipoIdentificacion,
      nombre: payload.nombre,
      apellido: payload.apellido,
      direccion: payload.direccion,
      telefono: payload.telefono,
      ciudad: payload.ciudad,
      email: payload.email,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
      activo: payload.activo ?? true,
    });

    let personaId = payload.personaId ?? null;
    try {
      if (personaId) {
        await api.put(`${PERSONA_ENDPOINT}/${personaId}`, personaPayload);
      } else {
        const createdPersona = await api.post(PERSONA_ENDPOINT, personaPayload);
        personaId = createdPersona.data?.id;
      }
    } catch (error) {
      throw this.normalizeError(error);
    }

    const apiPayload = this.sanitize({
      persona_id: personaId,
      rol_id: payload.rolId,
      username: payload.username,
      password: payload.password, // solo si se envia
      requiere_cambio_password: payload.requiereCambioPassword,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    });
    let res;
    try {
      res = await api.put(`/api/usuarios/${id}`, apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || { ...payload, id, personaId };
    const personaNombre = `${payload.nombre || ''} ${payload.apellido || ''}`.trim();
    return this.mapEntity(item, { ...payload, id, personaId, personaNombre });
  }

  async delete(id) {
    try {
      await api.delete(`/api/usuarios/${id}`);
    } catch (error) {
      throw this.normalizeError(error);
    }
    return true;
  }

  async getPersonaCatalog() {
    // ya no se usa combo, pero se deja por compatibilidad si se requiere
    const res = await api.get('/api/personas');
    const personas = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    return personas
      .filter(p => p.activo !== false)
      .map(p => ({
        value: p.id,
        label: `${p.nombre || ''} ${p.apellido || ''}`.trim() || p.identificacion || 'Persona',
        extra: p.identificacion,
      }));
  }

  async getRolCatalog() {
    const res = await api.get('/api/roles');
    const roles = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    return roles
      .filter(r => r.activo !== false)
      .map(r => ({ value: r.id, label: r.nombre }));
  }

  async findPersonaByIdentificacion(identificacion) {
    const ident = (identificacion || '').trim();
    if (!ident) return null;
    try {
      const res = await api.get(`${PERSONA_ENDPOINT}?identificacion=${encodeURIComponent(ident)}`);
      const personas = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
      const found = personas.find(p => p.identificacion === ident);
      return found || null;
    } catch {
      return null;
    }
  }
}
