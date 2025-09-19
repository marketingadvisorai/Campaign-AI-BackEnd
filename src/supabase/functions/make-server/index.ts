import { Hono } from 'npm:hono@4.5.8';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { getDatabaseAdapter } from '../../../server/adapters/database.ts';
import { AuthService } from '../../../server/auth/service.ts';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const db = getDatabaseAdapter();
const authService = new AuthService(db);

async function getUser(request: Request) {
  return authService.authenticateRequest(request);
}

const OAUTH_PROVIDERS = {
  google: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientIdEnvKey: 'GOOGLE_OAUTH_CLIENT_ID',
    redirectUriEnvKey: 'GOOGLE_OAUTH_REDIRECT_URI',
    defaultScope: 'openid email profile',
  },
} as const;

type SupportedOAuthProvider = keyof typeof OAUTH_PROVIDERS;

// Authentication Routes
app.get('/auth/oauth/:provider', (c) => {
  const providerParam = c.req.param('provider').toLowerCase();

  if (!(providerParam in OAUTH_PROVIDERS)) {
    return c.json({ error: 'Unsupported OAuth provider' }, 400);
  }

  const providerKey = providerParam as SupportedOAuthProvider;
  const config = OAUTH_PROVIDERS[providerKey];

  const clientId = Deno.env.get(config.clientIdEnvKey);
  const redirectUri = Deno.env.get(config.redirectUriEnvKey);

  if (!clientId || !redirectUri) {
    return c.json({ error: 'OAuth provider is not configured' }, 500);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.defaultScope,
    access_type: 'offline',
    prompt: 'consent',
  });

  const state = c.req.query('state');
  if (state) {
    params.set('state', state);
  }

  const authorizationUrl = `${config.authorizationEndpoint}?${params.toString()}`;
  const acceptHeader = c.req.header('accept') ?? '';

  if (acceptHeader.includes('application/json')) {
    return c.json({ authorizationUrl });
  }

  return c.redirect(authorizationUrl);
});

app.post('/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const { user, token } = await authService.signUp({ email, password, name });
    await db.saveUserSetup(user.id, { isSetupComplete: false });
    return c.json({ user, token });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    const result = await authService.validateCredentials(email, password);
    return c.json(result);
  } catch (error) {
    console.log('Login error:', error);
    return c.json({ error: error.message }, 401);
  }
});

app.get('/auth/me', async (c) => {
  try {
    const user = await authService.authenticateRequest(c.req.raw);
    return c.json({ user });
  } catch (error) {
    console.log('Get current user error:', error);
    return c.json({ error: error.message }, 401);
  }
});

app.post('/auth/logout', async (c) => {
  try {
    // Ensure the token is valid before logging out
    await authService.authenticateRequest(c.req.raw);
    // No server-side session state is persisted, but this ensures client tokens can be cleared
    return c.json({ success: true });
  } catch (error) {
    console.log('Logout error:', error);
    return c.json({ error: error.message }, 401);
  }
});

// User Setup Routes
app.get('/user/setup-status', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const setupData = (await db.getUserSetup(user.id)) ?? { isSetupComplete: false };
    return c.json(setupData);
  } catch (error) {
    console.log('Setup status error:', error);
    return c.json({ error: error.message }, 401);
  }
});

app.post('/user/complete-setup', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const setupData = await c.req.json();
    const completion = {
      isSetupComplete: true,
      completedAt: new Date().toISOString(),
      setupData,
    };
    await db.saveUserSetup(user.id, completion);
    return c.json({ success: true });
  } catch (error) {
    console.log('Complete setup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route
app.all('*', (c) => {
  return c.json({ error: 'Not found' }, 404);
});

Deno.serve(app.fetch);
