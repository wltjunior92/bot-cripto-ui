import Swal, { SweetAlertCustomClass } from 'sweetalert2'

const customClass: SweetAlertCustomClass = {
  popup: 'sweetalert-popup',
  confirmButton: 'sweetalert-confirm-btn',
}

export async function confirmAction(message: string) {
  const { isConfirmed } = await Swal.fire({
    title: 'Tem certeza?',
    text: message,
    showCancelButton: true,
    cancelButtonText: 'Não',
    confirmButtonText: 'Sim, pode cancelar!',
    customClass,
  })

  return isConfirmed
}
