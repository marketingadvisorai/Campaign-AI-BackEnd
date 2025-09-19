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

// Authentication Routes
app.get('/auth/me', async (c) => {
  try {
    const user = await authService.authenticateRequest(c.req.raw);
    return c.json({ user });
  } catch (error) {
    console.log('Auth me error:', error);
    const message = error instanceof Error ? error.message : 'Invalid token';
    return c.json({ error: message }, 401);
  }
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
