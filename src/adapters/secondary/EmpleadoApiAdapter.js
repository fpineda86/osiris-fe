/**
 * Adapter para Empleados.
 */
import api from '../../api/client.js';
import Empleado from '../../domain/entities/Empleado.js';
import EmpleadoRepository from '../../domain/ports/EmpleadoRepository.js';

const PERSONA_ENDPOINT = '/api/personas';

export default class EmpleadoApiAdapter extends EmpleadoRepository {
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
    return new Empleado({
      id: item.id ?? fallback.id,
      personaId: item.persona_id ?? item.personaId ?? fallback.personaId,
      salario: item.salario ?? fallback.salario,
      fechaIngreso: item.fecha_ingreso ?? item.fechaIngreso ?? fallback.fechaIngreso,
      fechaNacimiento: item.fecha_nacimiento ?? item.fechaNacimiento ?? fallback.fechaNacimiento,
      fechaSalida: item.fecha_salida ?? item.fechaSalida ?? fallback.fechaSalida,
      username: item.usuario?.username ?? fallback.username ?? '',
      rolId: item.usuario?.rol_id ?? item.rol_id ?? fallback.rolId,
      personaIdentificacion: item.persona?.identificacion ?? fallback.personaIdentificacion ?? '',
      personaNombre: item.persona ? `${item.persona.nombre || ''} ${item.persona.apellido || ''}`.trim() : fallback.personaNombre || '',
      rolNombre: item.usuario?.rol?.nombre || fallback.rolNombre || '',
      activo: item.activo ?? fallback.activo ?? true,
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
            salario: 'salario',
            fecha_ingreso: 'fechaIngreso',
            fecha_nacimiento: 'fechaNacimiento',
            fecha_salida: 'fechaSalida',
            username: 'username',
            password: 'password',
            rol_id: 'rolId',
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
    const res = await api.get('/api/empleados');
    const data = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    const activeOnly = data.filter(e => e.activo !== false);
    return activeOnly.map(e => this.mapEntity(e));
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

    const userPayload = this.sanitize({
      username: payload.username,
      password: payload.password,
      rol_id: payload.rolId,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    });

    const apiPayload = this.sanitize({
      persona_id: personaId,
      salario: payload.salario,
      fecha_ingreso: payload.fechaIngreso,
      fecha_nacimiento: payload.fechaNacimiento,
      fecha_salida: payload.fechaSalida,
      usuario: userPayload,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    });

    let res;
    try {
      res = await api.post('/api/empleados', apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || { ...payload, personaId };
    const personaNombre = `${payload.nombre || ''} ${payload.apellido || ''}`.trim();
    return this.mapEntity(item, { ...payload, personaId, personaNombre, personaIdentificacion: payload.identificacion });
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

    const userPayload = this.sanitize({
      username: payload.username,
      password: payload.password,
      rol_id: payload.rolId,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    });

    const apiPayload = this.sanitize({
      persona_id: personaId,
      salario: payload.salario,
      fecha_ingreso: payload.fechaIngreso,
      fecha_nacimiento: payload.fechaNacimiento,
      fecha_salida: payload.fechaSalida,
      usuario: userPayload,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    });

    let res;
    try {
      res = await api.put(`/api/empleados/${id}`, apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || { ...payload, id, personaId };
    const personaNombre = `${payload.nombre || ''} ${payload.apellido || ''}`.trim();
    return this.mapEntity(item, { ...payload, id, personaId, personaNombre, personaIdentificacion: payload.identificacion });
  }

  async delete(id) {
    try {
      await api.delete(`/api/empleados/${id}`);
    } catch (error) {
      throw this.normalizeError(error);
    }
    return true;
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
