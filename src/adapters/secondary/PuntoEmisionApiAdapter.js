/**
 * Adapter para Puntos de Emisión.
 */
import api from '../../api/client.js';
import PuntoEmision from '../../domain/entities/PuntoEmision.js';
import PuntoEmisionRepository from '../../domain/ports/PuntoEmisionRepository.js';
import EmpresaApiAdapter from './EmpresaApiAdapter.js';
import SucursalApiAdapter from './SucursalApiAdapter.js';

export default class PuntoEmisionApiAdapter extends PuntoEmisionRepository {
  constructor() {
    super();
    this.empresaAdapter = new EmpresaApiAdapter();
    this.sucursalAdapter = new SucursalApiAdapter();
  }

  mapEntity(item, fallback = {}) {
    return new PuntoEmision({
      id: item.id ?? fallback.id,
      codigo: item.codigo ?? fallback.codigo,
      descripcion: item.descripcion ?? fallback.descripcion,
      secuencialActual: item.secuencial_actual ?? item.secuencialActual ?? fallback.secuencialActual,
      usuarioAuditoria: item.usuario_auditoria ?? fallback.usuarioAuditoria,
      empresaId: item.empresa_id ?? item.empresaId ?? fallback.empresaId,
      sucursalId: item.sucursal_id ?? item.sucursalId ?? fallback.sucursalId,
      activo: item.activo ?? fallback.activo ?? true,
    });
  }

  mapFieldKey(path) {
    const map = {
      codigo: 'codigo',
      descripcion: 'descripcion',
      secuencial_actual: 'secuencialActual',
      usuario_auditoria: 'usuarioAuditoria',
      empresa_id: 'empresaId',
      sucursal_id: 'sucursalId',
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
    const res = await api.get('/api/puntos-emision');
    const data = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    const activeOnly = data.filter(item => item.activo !== false);
    return activeOnly.map(item => this.mapEntity(item));
  }

  async create(payload) {
    const apiPayload = {
      codigo: payload.codigo,
      descripcion: payload.descripcion,
      secuencial_actual: payload.secuencialActual,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
      empresa_id: payload.empresaId,
      sucursal_id: payload.sucursalId,
      activo: payload.activo ?? true,
    };

    let res;
    try {
      res = await api.post('/api/puntos-emision', apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || payload;
    return this.mapEntity(item, payload);
  }

  async update(id, payload) {
    const apiPayload = {
      codigo: payload.codigo,
      descripcion: payload.descripcion,
      secuencial_actual: payload.secuencialActual,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
      empresa_id: payload.empresaId,
      sucursal_id: payload.sucursalId,
      activo: payload.activo ?? true,
    };

    let res;
    try {
      res = await api.put(`/api/puntos-emision/${id}`, apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || { ...payload, id };
    return this.mapEntity(item, { ...payload, id });
  }

  /**
   * Eliminación lógica: activo=false.
   */
  async delete(id) {
    try {
      await api.put(`/api/puntos-emision/${id}`, { activo: false, usuario_auditoria: 'frontend' });
    } catch (error) {
      throw this.normalizeError(error);
    }
    return true;
  }

  async getEmpresaCatalog() {
    const empresas = await this.empresaAdapter.getAll();
    return empresas.map(e => ({ value: e.id, label: e.razonSocial || e.nombreComercial || e.id })).filter(opt => opt.value);
  }

  async getSucursalCatalog(empresaId = null) {
    const sucursales = await this.sucursalAdapter.getAll();
    const filtered = empresaId ? sucursales.filter(s => s.empresaId === empresaId) : sucursales;
    return filtered.map(s => ({ value: s.id, label: `${s.codigo} - ${s.nombre}` })).filter(opt => opt.value);
  }
}
