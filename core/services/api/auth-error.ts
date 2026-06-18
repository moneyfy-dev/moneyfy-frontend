const AUTH_ERROR_STATUSES = new Set([401, 403, 417]);
const AUTH_ERROR_PATTERNS = [
  'jwt inv',
  'jwt invalido',
  'jwt inválido',
  'token inv',
  'token invalido',
  'token inválido',
  'sesion invalida',
  'sesión inválida',
  'unauthorized',
  'forbidden',
];

function collectErrorText(error: unknown): string {
  if (!error || typeof error !== 'object') return '';

  const candidate = error as {
    message?: unknown;
    response?: {
      data?: {
        message?: unknown;
        data?: unknown;
      };
    };
  };

  return [
    candidate.message,
    candidate.response?.data?.message,
    candidate.response?.data?.data,
  ]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase();
}

export function isAuthenticationError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const status = (error as { response?: { status?: number } }).response?.status;
  if (status && AUTH_ERROR_STATUSES.has(status)) return true;

  const errorText = collectErrorText(error);
  return AUTH_ERROR_PATTERNS.some((pattern) => errorText.includes(pattern));
}
