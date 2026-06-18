import { isAuthenticationError } from '../auth-error';

describe('isAuthenticationError', () => {
  it.each([401, 403])('treats HTTP %i as an authentication error', (status) => {
    expect(isAuthenticationError({ response: { status } })).toBe(true);
  });

  it('detects an invalid JWT returned inside the API payload', () => {
    expect(
      isAuthenticationError({
        response: {
          status: 428,
          data: { message: 'JWT inválido: no es posible continuar' },
        },
      }),
    ).toBe(true);
  });

  it('does not invalidate the session after a network error', () => {
    expect(isAuthenticationError({ message: 'Network Error' })).toBe(false);
  });

  it('does not invalidate the session after a server error', () => {
    expect(isAuthenticationError({ response: { status: 500 } })).toBe(false);
  });
});
