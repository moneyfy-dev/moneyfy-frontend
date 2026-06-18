import { extractAuthTokens, mergeAuthTokens } from '../authTokens';

describe('extractAuthTokens', () => {
  it('reads the current backend token contract', () => {
    expect(
      extractAuthTokens({
        data: {
          refreshToken: 'refresh-new',
          sessionToken: 'session-new',
        },
      }),
    ).toEqual({
      refreshToken: 'refresh-new',
      sessionToken: 'session-new',
    });
  });

  it('keeps compatibility with the legacy token contract', () => {
    expect(
      extractAuthTokens({
        data: {
          tokens: {
            jwtRefresh: 'refresh-legacy',
            jwtSession: 'session-legacy',
          },
        },
      }),
    ).toEqual({
      refreshToken: 'refresh-legacy',
      sessionToken: 'session-legacy',
    });
  });

  it('returns null when the payload is incomplete', () => {
    expect(extractAuthTokens({ data: { sessionToken: 'session-only' } })).toBeNull();
  });
});

describe('mergeAuthTokens', () => {
  it('uses a renewed session token with the current refresh token', () => {
    expect(
      mergeAuthTokens(
        { token: 'refresh-current', sessionToken: 'session-current' },
        { sessionToken: 'session-renewed' },
      ),
    ).toEqual({
      refreshToken: 'refresh-current',
      sessionToken: 'session-renewed',
    });
  });

  it('uses both renewed tokens when the backend rotates both headers', () => {
    expect(
      mergeAuthTokens(
        { token: 'refresh-current', sessionToken: 'session-current' },
        { refreshToken: 'refresh-renewed', sessionToken: 'session-renewed' },
      ),
    ).toEqual({
      refreshToken: 'refresh-renewed',
      sessionToken: 'session-renewed',
    });
  });

  it('returns null if there is no complete token pair', () => {
    expect(
      mergeAuthTokens(
        { token: null, sessionToken: null },
        { sessionToken: 'session-renewed' },
      ),
    ).toBeNull();
  });
});
