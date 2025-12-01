/**
 * Adapter para Clientes (crea persona en backend).
 */
import api from '../../api/client.js';
import Cliente from '../../domain/entities/Cliente.js';
import ClienteRepository from '../../domain/ports/ClienteRepository.js';
import TipoClienteApiAdapter from './TipoClienteApiAdapter.js';

const PERSONA_ENDPOINT = '/api/personas';

export default class ClienteApiAdapter extends ClienteRepository {
  constructor() {
    super();
    this.tipoAdapter = new TipoClienteApiAdapter();
  }

  sanitize(obj, {keepNullKeys = []} = {}) {
    const out = {};
    Object.entries(obj || {}).forEach(([k, v]) => {
      if (keepNullKeys.includes(k)) {
        out[k] = v ?? null;
        return;
      }
      if (v === undefined || v === null) return;
      if (typeof v === 'string' && v.trim() === '') return;
      out[k] = v;
    });
    return out;
  }

  mapFieldKey(path) {
    const map = {
      identificacion: 'identificacion',
      tipo_identificacion: 'tipoIdentificacion',
      nombre: 'nombre',
      apellido: 'apellido',
      direccion: 'direccion',
      telefono: 'telefono',
      ciudad: 'ciudad',
      email: 'email',
      usuario_auditoria: 'usuarioAuditoria',
      persona_id: 'personaId',
      tipo_cliente_id: 'tipoClienteId',
      activo: 'activo',
    };
    // paths like persona.identificacion
    if (typeof path === 'string' && path.startsWith('persona.')) {
      const key = path.replace('persona.', '');
      return map[key] || key;
    }
    return map[path] || path;
  }

  normalizeError(error) {
    const detail = error?.response?.data?.detail;
    const fieldErrors = {};
    let message = error?.message || 'Error desconocido';

    if (Array.isArray(detail)) {
      message = detail.map(d => d.msg || JSON.stringify(d)).join(' / ');
      detail.forEach(d => {
        let path = null;
        if (Array.isArray(d.loc)) {
          // If nested like ['body','persona','identificacion']
          path = d.loc.slice(1).join('.');
        }
        if (path) {
          const key = this.mapFieldKey(path);
          fieldErrors[key] = d.msg || String(d);
        }
      });
    } else if (detail) {
      message = typeof detail === 'string' ? detail : JSON.stringify(detail);
    }

    const err = new Error(message);
    err.fieldErrors = fieldErrors;
    return err;
  }

  mapEntity(item, fallback = {}) {
    const persona = item.persona || {};
    return new Cliente({
      id: item.id ?? fallback.id,
      personaId: item.persona_id ?? persona.id ?? fallback.personaId,
      tipoClienteId: item.tipo_cliente_id ?? item.tipoClienteId ?? fallback.tipoClienteId,
      identificacion: persona.identificacion ?? fallback.identificacion,
      tipoIdentificacion: persona.tipo_identificacion ?? fallback.tipoIdentificacion,
      nombre: persona.nombre ?? fallback.nombre,
      apellido: persona.apellido ?? fallback.apellido,
      direccion: persona.direccion ?? fallback.direccion,
      telefono: persona.telefono ?? fallback.telefono,
      ciudad: persona.ciudad ?? fallback.ciudad,
      email: persona.email ?? fallback.email,
      usuarioAuditoria: persona.usuario_auditoria ?? item.usuario_auditoria ?? fallback.usuarioAuditoria,
      activo: item.activo ?? persona.activo ?? fallback.activo ?? true,
    });
  }

  async getAll() {
    const res = await api.get('/api/clientes');
    const data = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    const activeOnly = data.filter(item => item.activo !== false);
    return activeOnly.map(item => this.mapEntity(item));
  }

  async create(payload) {
    const persona = this.sanitize({
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
        await api.put(`${PERSONA_ENDPOINT}/${personaId}`, persona);
      } else {
        const createdPersona = await api.post(PERSONA_ENDPOINT, persona);
        personaId = createdPersona.data?.id;
      }
    } catch (error) {
      throw this.normalizeError(error);
    }

    const apiPayload = this.sanitize({
      persona_id: personaId,
      tipo_cliente_id: payload.tipoClienteId,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    }, { keepNullKeys: ['persona_id'] });

    let res;
    try {
      res = await api.post('/api/clientes', apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || payload;
    return this.mapEntity(item, payload);
  }

  async update(id, payload) {
    const persona = this.sanitize({
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
        await api.put(`${PERSONA_ENDPOINT}/${personaId}`, persona);
      } else {
        const createdPersona = await api.post(PERSONA_ENDPOINT, persona);
        personaId = createdPersona.data?.id;
      }
    } catch (error) {
      throw this.normalizeError(error);
    }

    const apiPayload = this.sanitize({
      persona_id: personaId,
      tipo_cliente_id: payload.tipoClienteId,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    }, { keepNullKeys: ['persona_id'] });

    let res;
    try {
      res = await api.put(`/api/clientes/${id}`, apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || { ...payload, id };
    return this.mapEntity(item, { ...payload, id });
  }

  async delete(id) {
    try {
      await api.delete(`/api/clientes/${id}`);
    } catch (error) {
      throw this.normalizeError(error);
    }
    return true;
  }

  async findPersonaByIdentificacion(identificacion) {
    const ident = (identificacion || '').trim();
    if (!ident) return null;
    try {
      const res = await api.get(`${PERSONA_ENDPOINT}?identificacion=${encodeURIComponent(ident)}`);
      // backend may return items meta or plain array
      const personas = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
      const found = personas.find(p => p.identificacion === ident);
      return found || null;
    } catch (error) {
      // If the API does not support filter, fallback: fetch all and filter
      try {
        const resAll = await api.get(PERSONA_ENDPOINT);
        const personas = Array.isArray(resAll.data?.items) ? resAll.data.items : Array.isArray(resAll.data) ? resAll.data : [];
        const found = personas.find(p => p.identificacion === ident);
        return found || null;
      } catch (err) {
        throw this.normalizeError(err);
      }
    }
  }

  async getTipoClienteCatalog() {
    const tipos = await this.tipoAdapter.getAll();
    return tipos.map(t => ({ value: t.id, label: t.nombre })).filter(opt => opt.value);
  }
}
