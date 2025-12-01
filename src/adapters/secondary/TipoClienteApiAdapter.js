/**
 * Adapter para Tipos de Cliente.
 */
import api from '../../api/client.js';
import TipoCliente from '../../domain/entities/TipoCliente.js';
import TipoClienteRepository from '../../domain/ports/TipoClienteRepository.js';

export default class TipoClienteApiAdapter extends TipoClienteRepository {
  mapFieldKey(path) {
    const map = {
      nombre: 'nombre',
      descuento: 'descuento',
      usuario_auditoria: 'usuarioAuditoria',
    };
    return map[path] || path;
  }

  normalizeError(error) {
    const detail = error?.response?.data?.detail;
    const fieldErrors = {};
    let message = error?.message || 'Error desconocido';

    if (Array.isArray(detail)) {
      message = detail.map(d => d.msg || JSON.stringify(d)).join(' / ');
      detail.forEach(d => {
        const path = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : null;
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
    return new TipoCliente({
      id: item.id ?? fallback.id,
      nombre: item.nombre ?? fallback.nombre,
      descuento: item.descuento ?? fallback.descuento,
      usuarioAuditoria: item.usuario_auditoria ?? fallback.usuarioAuditoria,
    });
  }

  async getAll() {
    const res = await api.get('/api/tipos-cliente');
    const data = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    return data.map(item => this.mapEntity(item));
  }

  async create(payload) {
    const apiPayload = {
      nombre: payload.nombre,
      descuento: payload.descuento,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    };

    let res;
    try {
      res = await api.post('/api/tipos-cliente', apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || payload;
    return this.mapEntity(item, payload);
  }

  async update(id, payload) {
    const apiPayload = {
      nombre: payload.nombre,
      descuento: payload.descuento,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
    };

    let res;
    try {
      res = await api.put(`/api/tipos-cliente/${id}`, apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || { ...payload, id };
    return this.mapEntity(item, { ...payload, id });
  }

  async delete(id) {
    try {
      await api.delete(`/api/tipos-cliente/${id}`);
    } catch (error) {
      throw this.normalizeError(error);
    }
    return true;
  }
}
