import api from './api'

export default {
  /**
   * Buscar artículo por código de barras
   * @param {string} codigo - Código de barras o clave de artículo
   * @param {number} sucursalId - ID de la sucursal
   * @returns {Promise} Artículo encontrado
   */
  async buscarPorCodigo(codigo, sucursalId) {
    return await api.get(`/articulos/buscar/${codigo}`, {
      params: { sucursalId }
    })
  },

  /**
   * Obtener precio de un artículo
   * @param {number} articuloId - ID del artículo
   * @param {number} sucursalId - ID de la sucursal
   * @returns {Promise} Información de precio
   */
  async obtenerPrecio(articuloId, sucursalId) {
    return await api.get(`/articulos/${articuloId}/precio`, {
      params: { sucursalId }
    })
  }
}
