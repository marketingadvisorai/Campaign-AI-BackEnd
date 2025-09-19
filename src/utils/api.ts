const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const ACCESS_TOKEN_KEY = 'campaign-ai.accessToken';
const REFRESH_TOKEN_KEY = 'campaign-ai.refreshToken';
const USER_KEY = 'campaign-ai.user';

const oauthClientIds: Record<string, string | undefined> = {
  google: import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID,
};

const buildUrl = (path: string) => {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured.');
  }
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const getStoredAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const saveAccessToken = (token?: string | null) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

const saveRefreshToken = (token?: string | null) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const persistUser = (user: unknown) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

const parseJsonResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers || {});
  const token = getStoredAccessToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(buildUrl(path), {
      ...options,
      headers,
    });

    const data = await parseJsonResponse(response);

    if (!response.ok) {
      const errorMessage = (data as any)?.message || (data as any)?.error || response.statusText;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unexpected error while contacting the API.');
  }
};

const applyAuthSideEffects = (payload: any) => {
  if (!payload) return;

  const accessToken = payload.accessToken || payload.access_token || payload.token;
  const refreshToken = payload.refreshToken || payload.refresh_token;

  saveAccessToken(accessToken);
  saveRefreshToken(refreshToken);

  if (payload.user) {
    persistUser(payload.user);
  }
};

export const login = async ({ email, password }: { email: string; password: string; }) => {
  const result = await request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  applyAuthSideEffects(result);

  return result?.user ?? result;
};

export const signup = async ({ email, password, name }: { email: string; password: string; name?: string; }) => {
  const result = await request<any>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });

  applyAuthSideEffects(result);

  return result?.user ?? result;
};

export const logout = async () => {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (error) {
    // Swallow logout errors but ensure tokens are cleared
    console.warn('Logout request failed', error);
  } finally {
    clearTokens();
    persistUser(null);
  }
};

export const getCurrentUser = async () => {
  const token = getStoredAccessToken();
  if (!token) {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  try {
    const result = await request<any>('/auth/me');
    const user = result?.user ?? result ?? null;
    persistUser(user);
    return user;
  } catch (error) {
    clearTokens();
    persistUser(null);
    throw error;
  }
};

export const getSetupStatus = async () => {
  return await request<{ isSetupComplete: boolean }>('/user/setup-status');
};

export const completeSetup = async (payload: unknown) => {
  return await request('/user/complete-setup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const fetchIntegrations = async () => {
  return await request<any>('/integrations');
};

export const updateIntegration = async (category: string, providerId: string, data: Record<string, unknown>) => {
  return await request(`/integrations/${category}/${providerId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const testIntegration = async (category: string, providerId: string) => {
  return await request(`/integrations/${category}/${providerId}/test`, {
    method: 'POST',
  });
};

export const deleteIntegration = async (category: string, providerId: string) => {
  return await request(`/integrations/${category}/${providerId}`, {
    method: 'DELETE',
  });
};

export const getOAuthUrl = (provider: string, redirectUri: string = window.location.origin) => {
  const params = new URLSearchParams({ redirect_uri: redirectUri });
  const clientId = oauthClientIds[provider];
  if (clientId) {
    params.set('client_id', clientId);
  }
  return buildUrl(`/auth/oauth/${provider}?${params.toString()}`);
};

export const beginOAuthLogin = (provider: string, redirectUri: string = window.location.origin) => {
  window.location.href = getOAuthUrl(provider, redirectUri);
};

export const clearStoredSession = () => {
  clearTokens();
  persistUser(null);
};
