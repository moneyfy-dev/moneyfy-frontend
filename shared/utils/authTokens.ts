export interface AuthTokenPair {
  refreshToken: string;
  sessionToken: string;
}

interface StoredTokens {
  token: string | null;
  sessionToken: string | null;
}

interface PartialAuthTokens {
  refreshToken?: string | null;
  sessionToken?: string | null;
}

export function extractAuthTokens(payload: any): AuthTokenPair | null {
  const data = payload?.data ?? payload;
  const refreshToken = data?.refreshToken ?? data?.tokens?.jwtRefresh;
  const sessionToken = data?.sessionToken ?? data?.tokens?.jwtSession;

  if (!refreshToken || !sessionToken) {
    return null;
  }

  return { refreshToken, sessionToken };
}

export function mergeAuthTokens(
  currentTokens: StoredTokens,
  incomingTokens: PartialAuthTokens,
): AuthTokenPair | null {
  const refreshToken = incomingTokens.refreshToken ?? currentTokens.token;
  const sessionToken = incomingTokens.sessionToken ?? currentTokens.sessionToken;

  if (!refreshToken || !sessionToken) {
    return null;
  }

  return { refreshToken, sessionToken };
}
