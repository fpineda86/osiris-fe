/**
 * Adapter para Proveedores.
 */
import api from '../../api/client.js';
import Proveedor from '../../domain/entities/Proveedor.js';
import ProveedorRepository from '../../domain/ports/ProveedorRepository.js';
import EmpresaApiAdapter from './EmpresaApiAdapter.js';

const PERSONA_ENDPOINT = '/api/personas';
const PROVEEDOR_ENDPOINT = '/api/proveedores-persona';

export default class ProveedorApiAdapter extends ProveedorRepository {
  constructor() {
    super();
    this.empresaAdapter = new EmpresaApiAdapter();
  }

  sanitize(obj, { keepNullKeys = [] } = {}) {
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
            nombre_comercial: 'nombreComercial',
            tipo_contribuyente_id: 'tipoContribuyenteId',
          };
          fieldErrors[map[key] || key] = d.msg || String(d);
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
    const tipo = item.tipo_contribuyente || {};
    return new Proveedor({
      id: item.id ?? fallback.id,
      personaId: item.persona_id ?? persona.id ?? fallback.personaId,
      nombreComercial: item.nombre_comercial ?? fallback.nombreComercial,
      tipoContribuyenteId: item.tipo_contribuyente_id ?? item.tipoContribuyenteId ?? fallback.tipoContribuyenteId,
      tipoContribuyenteNombre: tipo.nombre ?? fallback.tipoContribuyenteNombre,
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
    const [proveedoresRes, personasRes, tiposCatalog] = await Promise.all([
      api.get(PROVEEDOR_ENDPOINT),
      api.get(PERSONA_ENDPOINT),
      this.getTipoContribuyenteCatalog(),
    ]);
    const data = Array.isArray(proveedoresRes.data?.items) ? proveedoresRes.data.items : Array.isArray(proveedoresRes.data) ? proveedoresRes.data : [];
    const personasArr = Array.isArray(personasRes.data?.items) ? personasRes.data.items : Array.isArray(personasRes.data) ? personasRes.data : [];
    const personaMap = personasArr
      .filter(p => p.activo !== false)
      .reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
    const tipoMap = Array.isArray(tiposCatalog)
      ? tiposCatalog.reduce((acc, t) => { acc[t.value] = t; return acc; }, {})
      : {};

    const activeOnly = data.filter(item => item.activo !== false);
    return activeOnly.map(item => {
      const persona = item.persona || personaMap[item.persona_id] || personaMap[item.personaId];
      const tipo = item.tipo_contribuyente || tipoMap[item.tipo_contribuyente_id] || tipoMap[item.tipoContribuyenteId];
      const tipoContribuyenteNombre = tipo?.label || tipo?.nombre;
      return this.mapEntity({ ...item, persona, tipo_contribuyente: { nombre: tipoContribuyenteNombre } });
    });
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
      nombre_comercial: payload.nombreComercial,
      tipo_contribuyente_id: payload.tipoContribuyenteId,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    }, { keepNullKeys: ['persona_id'] });

    let res;
    let tiposCatalog = [];
    try {
      tiposCatalog = await this.getTipoContribuyenteCatalog();
      res = await api.post(PROVEEDOR_ENDPOINT, apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || payload;
    const tipoLabel = (tiposCatalog || []).find(t => t.value === apiPayload.tipo_contribuyente_id)?.label;
    const tipoContribuyenteNombre = tipoLabel || apiPayload.tipo_contribuyente_id;
    return this.mapEntity(item, { ...payload, personaId, tipoContribuyenteNombre });
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
      nombre_comercial: payload.nombreComercial,
      tipo_contribuyente_id: payload.tipoContribuyenteId,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    }, { keepNullKeys: ['persona_id'] });

    let res;
    try {
      const tiposCatalog = await this.getTipoContribuyenteCatalog();
      res = await api.put(`${PROVEEDOR_ENDPOINT}/${id}`, apiPayload);
      const tipoLabel = (tiposCatalog || []).find(t => t.value === apiPayload.tipo_contribuyente_id)?.label;
      const tipoContribuyenteNombre = tipoLabel || apiPayload.tipo_contribuyente_id;
      const item = res.data || { ...payload, id, personaId };
      return this.mapEntity(item, { ...payload, id, personaId, tipoContribuyenteNombre });
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async delete(id) {
    try {
      await api.delete(`${PROVEEDOR_ENDPOINT}/${id}`);
    } catch (error) {
      throw this.normalizeError(error);
    }
    return true;
  }

  async getTipoContribuyenteCatalog() {
    return this.empresaAdapter.getTipoContribuyenteCatalog();
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
