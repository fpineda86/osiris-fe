/**
 * Adapter para sucursales (implementa SucursalRepository).
 */
import api from '../../api/client.js';
import Sucursal from '../../domain/entities/Sucursal.js';
import SucursalRepository from '../../domain/ports/SucursalRepository.js';
import EmpresaApiAdapter from './EmpresaApiAdapter.js';

export default class SucursalApiAdapter extends SucursalRepository {
  constructor() {
    super();
    this.empresaAdapter = new EmpresaApiAdapter();
  }

  mapEntity(item, fallback = {}) {
    return new Sucursal({
      id: item.id ?? fallback.id,
      codigo: item.codigo ?? fallback.codigo,
      nombre: item.nombre ?? fallback.nombre,
      direccion: item.direccion ?? fallback.direccion,
      telefono: item.telefono ?? fallback.telefono,
      usuarioAuditoria: item.usuario_auditoria ?? fallback.usuarioAuditoria,
      empresaId: item.empresa_id ?? item.empresaId ?? fallback.empresaId,
      activo: item.activo ?? fallback.activo ?? true,
    });
  }

  mapFieldKey(path) {
    const map = {
      codigo: 'codigo',
      nombre: 'nombre',
      direccion: 'direccion',
      telefono: 'telefono',
      usuario_auditoria: 'usuarioAuditoria',
      empresa_id: 'empresaId',
      activo: 'activo',
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

  async getAll() {
    const res = await api.get('/api/sucursales');
    const data = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    const activeOnly = data.filter(item => item.activo !== false);
    return activeOnly.map(item => this.mapEntity(item));
  }

  async create(payload) {
    const apiPayload = {
      codigo: payload.codigo,
      nombre: payload.nombre,
      direccion: payload.direccion,
      telefono: payload.telefono,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
      empresa_id: payload.empresaId,
      activo: payload.activo ?? true,
    };

    let res;
    try {
      res = await api.post('/api/sucursales', apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || payload;
    return this.mapEntity(item, payload);
  }

  async update(id, payload) {
    const apiPayload = {
      codigo: payload.codigo,
      nombre: payload.nombre,
      direccion: payload.direccion,
      telefono: payload.telefono,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
      empresa_id: payload.empresaId,
      activo: payload.activo ?? true,
    };

    let res;
    try {
      res = await api.put(`/api/sucursales/${id}`, apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || { ...payload, id };
    return this.mapEntity(item, { ...payload, id });
  }

  /**
   * Eliminación lógica: se envía activo=false al endpoint de update.
   */
  async delete(id) {
    try {
      await api.put(`/api/sucursales/${id}`, { activo: false, usuario_auditoria: 'frontend' });
    } catch (error) {
      throw this.normalizeError(error);
    }
    return true;
  }

  /**
   * Catálogo de empresas para combo (usa adapter existente de empresas).
   */
  async getEmpresaCatalog() {
    const empresas = await this.empresaAdapter.getAll();
    return empresas
      .map(e => ({ value: e.id, label: e.nombreComercial || e.razonSocial || e.id }))
      .filter(opt => opt.value);
  }

  /**
   * Catálogo de sucursales activas para combo.
   */
  async getSucursalCatalog() {
    const sucursales = await this.getAll();
    return sucursales.map(s => ({ value: s.id, label: `${s.codigo} - ${s.nombre}` })).filter(opt => opt.value);
  }
}
