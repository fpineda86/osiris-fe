/**
 * Adapter que implementa EmpresaRepository y realiza llamadas HTTP al backend.
 * Responsable de mapear la respuesta JSON a las entidades del dominio.
 */
import api from '../../api/client.js';
import Empresa from '../../domain/entities/Empresa.js';
import EmpresaRepository from '../../domain/ports/EmpresaRepository.js';

export default class EmpresaApiAdapter extends EmpresaRepository {
  constructor() {
    super();
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

  mapFieldKey(path) {
    const map = {
      razon_social: 'razonSocial',
      nombre_comercial: 'nombreComercial',
      ruc: 'ruc',
      direccion_matriz: 'direccionMatriz',
      telefono: 'telefono',
      codigo_establecimiento: 'codigoEstablecimiento',
      obligado_contabilidad: 'obligadoContabilidad',
      tipo_contribuyente_id: 'tipoContribuyenteId',
      usuario_auditoria: 'usuarioAuditoria',
    };
    return map[path] || path;
  }

  normalizeThrow(error) {
    if (error?.response?.data?.detail) {
      return Array.isArray(error.response.data.detail)
        ? error.response.data.detail.map(d => d.msg || JSON.stringify(d)).join(' / ')
        : error.response.data.detail;
    }
    return error?.message || 'Error desconocido';
  }

  /**
   * Llama al endpoint GET /api/empresa y devuelve un array de Empresa.
   */
  async getAll() {
    const res = await api.get('/api/empresa');
    const data = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    return data.map(item => new Empresa({
      id: item.id,
      razonSocial: item.razon_social ?? item.razonSocial,
      nombreComercial: item.nombre_comercial ?? item.nombreComercial,
      ruc: item.ruc,
      direccionMatriz: item.direccion_matriz ?? item.direccionMatriz,
      telefono: item.telefono,
      codigoEstablecimiento: item.codigo_establecimiento ?? item.codigoEstablecimiento,
      obligadoContabilidad: item.obligado_contabilidad ?? item.obligadoContabilidad,
      tipoContribuyenteId: item.tipo_contribuyente_id ?? item.tipoContribuyenteId,
      activo: item.activo,
    }));
  }

  /**
   * Crea una empresa vía POST /api/empresa.
   * @param {{
   *  razonSocial: string,
   *  nombreComercial?: string,
   *  ruc: string,
   *  direccionMatriz?: string,
   *  telefono?: string,
   *  codigoEstablecimiento?: string,
   *  obligadoContabilidad?: boolean,
   *  tipoContribuyenteId?: string,
   *  activo?: boolean,
   * }} payload
   * @returns {Promise<Empresa>}
   */
  async create(payload) {
    const apiPayload = {
      razon_social: payload.razonSocial,
      nombre_comercial: payload.nombreComercial,
      ruc: payload.ruc,
      direccion_matriz: payload.direccionMatriz,
      telefono: payload.telefono,
      codigo_establecimiento: payload.codigoEstablecimiento,
      obligado_contabilidad: payload.obligadoContabilidad,
      tipo_contribuyente_id: payload.tipoContribuyenteId,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
      activo: payload.activo ?? true,
    };

    let res;
    try {
      res = await api.post('/api/empresa', apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }
    const item = res.data || payload;
    return new Empresa({
      id: item.id,
      razonSocial: item.razon_social ?? payload.razonSocial,
      nombreComercial: item.nombre_comercial ?? payload.nombreComercial,
      ruc: item.ruc ?? payload.ruc,
      direccionMatriz: item.direccion_matriz ?? payload.direccionMatriz,
      telefono: item.telefono ?? payload.telefono,
      codigoEstablecimiento: item.codigo_establecimiento ?? payload.codigoEstablecimiento,
      obligadoContabilidad: item.obligado_contabilidad ?? payload.obligadoContabilidad,
      tipoContribuyenteId: item.tipo_contribuyente_id ?? payload.tipoContribuyenteId,
      activo: item.activo ?? payload.activo ?? true,
    });
  }

  /**
   * Actualiza una empresa vía PUT /api/empresa/{id}.
   */
  async update(id, payload) {
    const apiPayload = {
      razon_social: payload.razonSocial,
      nombre_comercial: payload.nombreComercial,
      ruc: payload.ruc,
      direccion_matriz: payload.direccionMatriz,
      telefono: payload.telefono,
      codigo_establecimiento: payload.codigoEstablecimiento,
      obligado_contabilidad: payload.obligadoContabilidad,
      tipo_contribuyente_id: payload.tipoContribuyenteId,
      usuario_auditoria: payload.usuarioAuditoria || 'frontend',
      activo: payload.activo ?? true,
    };

    let res;
    try {
      res = await api.put(`/api/empresa/${id}`, apiPayload);
    } catch (error) {
      throw this.normalizeError(error);
    }

    const item = res.data || { ...payload, id };
    return new Empresa({
      id: item.id,
      razonSocial: item.razon_social ?? payload.razonSocial,
      nombreComercial: item.nombre_comercial ?? payload.nombreComercial,
      ruc: item.ruc ?? payload.ruc,
      direccionMatriz: item.direccion_matriz ?? payload.direccionMatriz,
      telefono: item.telefono ?? payload.telefono,
      codigoEstablecimiento: item.codigo_establecimiento ?? payload.codigoEstablecimiento,
      obligadoContabilidad: item.obligado_contabilidad ?? payload.obligadoContabilidad,
      tipoContribuyenteId: item.tipo_contribuyente_id ?? payload.tipoContribuyenteId,
      activo: item.activo ?? payload.activo ?? true,
    });
  }

  /**
   * Elimina una empresa vía DELETE /api/empresa/{id}.
   */
  async delete(id) {
    try {
      await api.delete(`/api/empresa/${id}`);
    } catch (error) {
      throw this.normalizeError(error);
    }
    return true;
  }

  /**
   * Obtiene catálogo de tipo de contribuyente (nombre/código) desde aux_tipo_contribuyente.
   * Ajusta la ruta si el backend expone otro path.
   */
  async getTipoContribuyenteCatalog() {
    // Catálogo estático mientras el endpoint no esté disponible.
    return [
      { value: '01', label: 'Persona Natural' },
      { value: '02', label: 'Sociedad' },
      { value: '03', label: 'RIMPE – Negocio Popular' },
      { value: '04', label: 'RIMPE – Emprendedor' },
      { value: '05', label: 'Gran Contribuyente' },
    ];
  }
}
