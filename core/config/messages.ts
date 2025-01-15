import { MessageConfig } from '@/core/context/message';

export const SUCCESS_MESSAGES: { [key: string]: MessageConfig } = {
  '/users/update': {
    showSuccessMessage: true,
    customSuccessMessage: 'Información actualizada correctamente'
  },
  '/users/change/password': {
    showSuccessMessage: true,
    customSuccessMessage: 'Contraseña actualizada correctamente'
  },
  '/accounts/create': {
    showSuccessMessage: true,
    customSuccessMessage: 'Cuenta bancaria creada exitosamente'
  },
  '/accounts/update': {
    showSuccessMessage: true,
    customSuccessMessage: 'Cuenta bancaria actualizada exitosamente'
  },
  '/accounts/delete': {
    showSuccessMessage: true,
    customSuccessMessage: 'Cuenta bancaria eliminada exitosamente'
  }
}; 