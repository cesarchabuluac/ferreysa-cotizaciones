import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCotizacionStore = defineStore('cotizacion', () => {
  // State
  const items = ref([])
  const clienteId = ref(1) // Cliente genérico "Mostrador"
  const monedaId = ref(1) // Peso mexicano por defecto
  const tipoCambio = ref(1.0)
  
  // Getters
  const itemsCount = computed(() => items.value.length)
  
  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => {
      const precioNeto = item.precioUnitario * item.unidades * (1 - (item.pctjeDscto / 100))
      return sum + precioNeto
    }, 0)
  })
  
  const totalImpuestos = computed(() => {
    return items.value.reduce((sum, item) => {
      const precioNeto = item.precioUnitario * item.unidades * (1 - (item.pctjeDscto / 100))
      const impuesto = precioNeto * (item.tasaImpuesto / 100)
      return sum + impuesto
    }, 0)
  })
  
  const total = computed(() => {
    return subtotal.value + totalImpuestos.value
  })
  
  // Actions
  function addItem(articulo) {

    console.log(articulo)

    // Verificar si el artículo ya existe
    const existingIndex = items.value.findIndex(
      item => item.articuloId === articulo.articulo_Id
    )
    
    if (existingIndex !== -1) {
      // Incrementar cantidad
      items.value[existingIndex].unidades++
    } else {
      // Agregar nuevo item
      items.value.push({
        articuloId: articulo.articulo_Id,
        claveArticulo: articulo.clave_Articulo,
        descripcion: articulo.nombre,
        unidades: 1,
        precioUnitario: articulo.precio,
        pctjeDscto: 0,
        tasaImpuesto: articulo.tasa_Impuesto || 8,
        posicion: items.value.length + 1
      })
    }
  }
  
  function removeItem(index) {
    items.value.splice(index, 1)
    // Reordenar posiciones
    items.value.forEach((item, idx) => {
      item.posicion = idx + 1
    })
  }
  
  function updateQuantity(index, cantidad) {
    if (cantidad > 0) {
      items.value[index].unidades = cantidad
    } else {
      removeItem(index)
    }
  }
  
  function updateDiscount(index, descuento) {
    if (descuento >= 0 && descuento <= 100) {
      items.value[index].pctjeDscto = descuento
    }
  }
  
  function clear() {
    items.value = []
    clienteId.value = 1
    monedaId.value = 1
    tipoCambio.value = 1.0
  }
  
  function setCliente(id) {
    clienteId.value = id
  }
  
  // Preparar DTOs para enviar al backend
  function getCotizacionDTO(sucursalId, usuarioId) {
    return {
      sucursalId,
      clienteId: clienteId.value,
      monedaId: monedaId.value,
      tipoCambio: tipoCambio.value,
      usuarioCreador: usuarioId,
      detalles: items.value.map(item => ({
        articuloId: item.articuloId,
        claveArticulo: item.claveArticulo,
        unidades: item.unidades,
        precioUnitario: item.precioUnitario,
        pctjeDscto: item.pctjeDscto,
        posicion: item.posicion
      }))
    }
  }
  
  return {
    // State
    items,
    clienteId,
    monedaId,
    tipoCambio,
    
    // Getters
    itemsCount,
    subtotal,
    totalImpuestos,
    total,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    updateDiscount,
    clear,
    setCliente,
    getCotizacionDTO
  }
})
