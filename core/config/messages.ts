export interface MessageState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | null;
}

export interface MessageConfig {
  showSuccessMessage: boolean;
  customSuccessMessage?: string;
  customErrorMessage?: string;
}

export type ErrorMessageMap = {
  [key: string]: {
    [statusCode: number]: string;
  };
};

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
  '/accounts/select': {
    showSuccessMessage: true,
    customSuccessMessage: 'Cuenta bancaria seleccionada exitosamente'
  },
  '/accounts/delete': {
    showSuccessMessage: true,
    customSuccessMessage: 'Cuenta bancaria eliminada exitosamente'
  },
  '/quoter/register/available/vehicles': {
    showSuccessMessage: true,
    customSuccessMessage: 'Vehículos registrados exitosamente'
  },
  '/quoter/register/insurer': {
    showSuccessMessage: true,
    customSuccessMessage: 'Aseguradora registrada exitosamente'
  }
};


export const DEFAULT_ERROR_MESSAGES: ErrorMessageMap = {
  '/auth/register': {
    410: 'El usuario ya existe en el sistema',
    423: 'El código de referido es incorrecto',
    424: 'Error al registrar usuario',
    428: 'Los datos proporcionados no son válidos'
  },
  '/auth/confirm/registration': {
    410: 'El código ha expirado o no es correcto',
    424: 'Error al confirmar el registro'
  },
  '/auth/log-in': {
    424: 'Error al iniciar sesión',
    226: 'Se requiere actualizar el dispositivo asociado'
  },
  '/auth/confirm/device/change': {
    410: 'El código ha expirado o no es correcto',
    424: 'Error al confirmar el cambio de dispositivo'
  },
  '/auth/restore/password': {
    424: 'Error al enviar el código de recuperación'
  },
  '/auth/confirm/password/reset': {
    410: 'El código ha expirado o no es correcto',
    424: 'Error al restablecer la contraseña'
  },
  '/auth/resend/code': {
    424: 'Error al reenviar el código'
  },
  '/auth/disable/account': {
    423: 'No es posible deshabilitar la cuenta: aún tienes dinero en el balance o transacciones pendientes',
    424: 'Error al deshabilitar la cuenta'
  },
  '/users/update': {
    424: 'Error al actualizar la información',
    428: 'Los datos proporcionados no son válidos'
  },
  '/users/change/password': {
    424: 'Error al cambiar la contraseña',
    428: 'Los datos proporcionados no son válidos'
  },
  '/users/hydration/data': {
    424: 'Error al obtener los datos del usuario'
  },
  '/users/list/referreds': {
    424: 'Error al obtener la lista de referidos'
  },
  '/accounts/create': {
    423: 'La cuenta bancaria ya existe',
    424: 'Error al crear la cuenta bancaria',
    428: 'Los datos de la cuenta no son válidos'
  },
  '/accounts/update': {
    424: 'Error al actualizar la cuenta bancaria',
    428: 'Los datos de la cuenta no son válidos'
  },
  '/accounts/delete': {
    424: 'Error al eliminar la cuenta bancaria'
  },
  '/quoter/search/vehicle': {
    423: 'Se requiere tener una cuenta bancaria para comenzar una cotización',
    424: 'Error al buscar el vehículo',
    428: 'Los datos proporcionados no son válidos'
  },
  '/quoter/search/plan': {
    424: 'Error al cotizar el vehículo',
    428: 'Los datos proporcionados no son válidos'
  },
  '/quoter/vehicle/quote': {
    424: 'Error al obtener la cotización',
    428: 'Los datos del vehículo no son válidos'
  },
  '/quoter/select/plan': {
    424: 'Error al seleccionar el plan',
    428: 'Los datos proporcionados no son válidos'
  },
  '/quoter/generate/transaction': {
    424: 'Error al generar la transacción'
  },
  '/quoter/finalize/quote': {
    424: 'Error al finalizar la cotización'
  },
  '/quoter/register/available/vehicles': {
    424: 'Error al registrar los vehículos'
  },
  '/quoter/search/available/vehicles': {
    423: 'Se requiere tener una cuenta bancaria para realizar la cotización manual',
    424: 'Error al buscar los vehículos disponibles'
  },
  '/quoter/register/insurer': {
    424: 'Error al registrar la aseguradora'
  },
  '/quoter/search/insurers': {
    424: 'Error al obtener las aseguradoras'
  }
}; 