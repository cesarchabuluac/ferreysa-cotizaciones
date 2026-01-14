import api from './api'

export default {
  /**
   * Crear una nueva cotización
   * @param {Object} cotizacionDTO - Datos de la cotización
   * @returns {Promise} Cotización creada con folio
   */
  async crear(cotizacionDTO) {
    return await api.post('/cotizaciones', cotizacionDTO)
  },

  /**
   * Obtener una cotización por folio
   * @param {string} folio - Folio de la cotización
   * @returns {Promise} Datos de la cotización
   */
  async obtenerPorFolio(folio) {
    return await api.get(`/cotizaciones/${folio}`)
  },

  /**
   * Imprimir una cotización
   * @param {string} folio - Folio de la cotización
   * @returns {Promise} Datos para impresión
   */
  async imprimir(folio) {
    return await api.get(`/cotizaciones/${folio}/imprimir`)
  },

  /**
   * Obtener el siguiente folio disponible
   * @param {number} sucursalId - ID de la sucursal
   * @returns {Promise} Siguiente folio
   */
  async siguienteFolio(sucursalId) {
    return await api.get('/cotizaciones/siguiente-folio', {
      params: { sucursalId }
    })
  }
}
