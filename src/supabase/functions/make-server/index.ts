import { Hono } from 'npm:hono@4.5.8';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Simple KV store simulation using Map for demo
const kvStore = new Map();

const kv = {
  async get(key: string) {
    return kvStore.get(key);
  },
  async set(key: string, value: any) {
    kvStore.set(key, value);
    return true;
  },
  async del(key: string) {
    return kvStore.delete(key);
  },
  async getByPrefix(prefix: string) {
    const results = [];
    for (const [key, value] of kvStore.entries()) {
      if (key.startsWith(prefix)) {
        results.push(value);
      }
    }
    return results;
  }
};

// Helper function to get user from token
async function getUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    throw new Error('No access token provided');
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    throw new Error('Invalid access token');
  }
  
  return user;
}

// Authentication Routes
app.post('/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    // Initialize user data
    await kv.set(`user:${data.user.id}:setup`, { isSetupComplete: false });
    await kv.set(`user:${data.user.id}:integrations`, {});
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// User Setup Routes
app.get('/user/setup-status', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const setupData = await kv.get(`user:${user.id}:setup`) || { isSetupComplete: false };
    
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
    
    // Save setup completion
    await kv.set(`user:${user.id}:setup`, { 
      isSetupComplete: true, 
      completedAt: new Date().toISOString(),
      setupData 
    });
    
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