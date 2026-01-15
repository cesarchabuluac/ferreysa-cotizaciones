import Swal from 'sweetalert2'

const baseConfig = {
  confirmButtonColor: '#8B1538',
  cancelButtonColor: '#546E7A',
  showClass: { popup: 'swal-animate-show' },
  hideClass: { popup: 'swal-animate-hide' },
  buttonsStyling: false,
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn swal-btn-cancel',
    denyButton: 'btn btn-secondary',
    popup: 'swal-popup-mobile'
  }
}

export function useAlerts() {
  const confirm = async ({ title, text, confirmButtonText = 'Confirmar', cancelButtonText = 'Cancelar', icon = 'question' }) => {
    const result = await Swal.fire({
      ...baseConfig,
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText
    })
    return result.isConfirmed
  }

  const success = (title, text) => {
    return Swal.fire({
      ...baseConfig,
      icon: 'success',
      title,
      text,
      confirmButtonText: 'Aceptar'
    })
  }

  const error = (title, text) => {
    return Swal.fire({
      ...baseConfig,
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Entendido'
    })
  }

  const info = (title, text) => {
    return Swal.fire({
      ...baseConfig,
      icon: 'info',
      title,
      text,
      confirmButtonText: 'Ok'
    })
  }

  const promptQuantity = async ({ title, defaultValue = 1, max = 999 }) => {
    const { value } = await Swal.fire({
      ...baseConfig,
      title,
      input: 'number',
      inputLabel: 'Cantidad',
      inputValue: defaultValue,
      inputAttributes: { min: 1, max, step: 1 },
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: (val) => {
        const num = Number(val)
        if (!num || num < 1) {
          Swal.showValidationMessage('Ingresa una cantidad válida')
        }
        return num
      }
    })
    return value
  }

  return { confirm, success, error, info, promptQuantity }
}
