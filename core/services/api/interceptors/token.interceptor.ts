import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { api } from '../config';
import { storage } from '@/shared/utils/storage';
import { extractAuthTokens, mergeAuthTokens } from '@/shared/utils/authTokens';

const PUBLIC_AUTH_ENDPOINTS = new Set([
  '/auth/register',
  '/auth/confirm/registration',
  '/auth/log-in',
  '/auth/restore/password',
  '/auth/confirm/password/reset',
  '/auth/resend/code',
]);

function getEndpoint(url?: string) {
  if (!url) return '';

  try {
    const parsedUrl = new URL(url, api.defaults.baseURL);
    return parsedUrl.pathname.replace(/^\/moneyfy/, '');
  } catch {
    return url.split('?')[0].replace(/^\/moneyfy/, '');
  }
}

function isPublicAuthEndpoint(url?: string) {
  return PUBLIC_AUTH_ENDPOINTS.has(getEndpoint(url));
}

function getResponseHeader(response: AxiosResponse, headerName: string): string | undefined {
  const headersWithGetter = response.headers as any;
  const axiosHeaderValue = typeof headersWithGetter?.get === 'function'
    ? headersWithGetter.get(headerName)
    : undefined;

  if (axiosHeaderValue) {
    return Array.isArray(axiosHeaderValue) ? axiosHeaderValue[0] : String(axiosHeaderValue);
  }

  const headers = response.headers as unknown as Record<string, string | string[] | undefined>;
  const value = headers[headerName] ?? headers[headerName.toLowerCase()];

  return Array.isArray(value) ? value[0] : value;
}

async function persistResponseTokens(response: AxiosResponse) {
  const bodyTokens = extractAuthTokens(response.data);

  if (bodyTokens) {
    await storage.auth.setTokens(bodyTokens.refreshToken, bodyTokens.sessionToken);
    return;
  }

  const newSessionToken = getResponseHeader(response, 'X-New-Session-Token');
  const newRefreshToken = getResponseHeader(response, 'X-New-Refresh-Token');

  if (!newSessionToken && !newRefreshToken) {
    return;
  }

  const tokens = mergeAuthTokens(await storage.auth.getTokens(), {
    refreshToken: newRefreshToken,
    sessionToken: newSessionToken,
  });

  if (tokens) {
    await storage.auth.setTokens(tokens.refreshToken, tokens.sessionToken);
  }
}

export const setupTokenInterceptor = () => {
  api.interceptors.request.use(
    async (config) => {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      if (!isPublicAuthEndpoint(config.url)) {
        const { token, sessionToken } = await storage.auth.getTokens();
        if (token && sessionToken) {
          config.headers.Authorization = `Bearer ${sessionToken}`;
          config.headers['X-New-Refresh-Token'] = token;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    async (response: AxiosResponse) => {
      await persistResponseTokens(response);
      return response;
    },
    (error) => Promise.reject(error)
  );
};
