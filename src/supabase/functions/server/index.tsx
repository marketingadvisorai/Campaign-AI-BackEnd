import { Hono } from 'npm:hono@4.5.8';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import {
  BillingEntry,
  CampaignRecord,
  ClientRecord,
  IntegrationRecord,
  getDatabaseAdapter,
} from '../../../server/adapters/database.ts';
import { AuthService } from '../../../server/auth/service.ts';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const db = getDatabaseAdapter();
const authService = new AuthService(db);

const OAUTH_PROVIDERS = {
  google: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientIdEnvKey: 'GOOGLE_OAUTH_CLIENT_ID',
    redirectUriEnvKey: 'GOOGLE_OAUTH_REDIRECT_URI',
    defaultScope: 'openid email profile',
  },
} as const;

type SupportedOAuthProvider = keyof typeof OAUTH_PROVIDERS;

// Helper function to get user from token
async function getUser(request: Request) {
  return authService.authenticateRequest(request);
}

// Authentication Routes
app.get('/make-server-5efafb23/auth/oauth/:provider', (c) => {
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

app.post('/make-server-5efafb23/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { user, token } = await authService.signUp({ email, password, name });

    // Initialize user data
    await db.saveUserSetup(user.id, { isSetupComplete: false });

    return c.json({ user, token });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/make-server-5efafb23/auth/login', async (c) => {
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
app.get('/make-server-5efafb23/user/setup-status', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const setupData = (await db.getUserSetup(user.id)) ?? { isSetupComplete: false };

    return c.json(setupData);
  } catch (error) {
    console.log('Setup status error:', error);
    return c.json({ error: error.message }, 401);
  }
});

app.post('/make-server-5efafb23/user/complete-setup', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const setupData = await c.req.json();

    const completion = {
      isSetupComplete: true,
      completedAt: new Date().toISOString(),
      setupData,
    };

    await db.saveUserSetup(user.id, completion);

    const workspace = {
      id: `ws_${user.id}_${Date.now()}`,
      name: 'Default Workspace',
      createdAt: new Date().toISOString(),
    };
    await db.saveUserWorkspace(user.id, workspace);

    return c.json({ success: true, workspace });
  } catch (error) {
    console.log('Complete setup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Integration Routes
app.get('/make-server-5efafb23/integrations', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const integrations = await db.listUserIntegrations(user.id);

    return c.json(integrations);
  } catch (error) {
    console.log('Get integrations error:', error);
    return c.json({ error: error.message }, 401);
  }
});

app.post('/make-server-5efafb23/integrations/:category/:provider', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { category, provider } = c.req.param();
    const data = await c.req.json();

    const integration: IntegrationRecord = {
      userId: user.id,
      category,
      provider,
      data: {
        ...data,
        connectedAt: new Date().toISOString(),
        status: 'connected',
      },
    };

    await db.upsertUserIntegration(integration);

    return c.json({ success: true });
  } catch (error) {
    console.log('Save integration error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-5efafb23/integrations/:category/:provider/test', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { category, provider } = c.req.param();

    const integration = await db.getUserIntegration(user.id, category, provider);

    if (!integration) {
      return c.json({ error: 'Integration not found' }, 404);
    }

    // Test the connection based on provider type
    let testResult = { success: false, message: 'Unknown provider' };

    switch (provider) {
      case 'openai':
        testResult = await testOpenAI(String(integration.api_key ?? integration.apiKey ?? ''));
        break;
      case 'anthropic':
        testResult = await testAnthropic(String(integration.api_key ?? integration.apiKey ?? ''));
        break;
      case 'google_ai':
        testResult = await testGoogleAI(String(integration.api_key ?? integration.apiKey ?? ''));
        break;
      default:
        testResult = { success: true, message: 'Test not implemented for this provider' };
    }

    return c.json(testResult);
  } catch (error) {
    console.log('Test integration error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete('/make-server-5efafb23/integrations/:category/:provider', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { category, provider } = c.req.param();

    await db.deleteUserIntegration(user.id, category, provider);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete integration error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Campaign Routes
app.get('/make-server-5efafb23/campaigns', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const campaigns = await db.listCampaigns(user.id);

    return c.json(campaigns);
  } catch (error) {
    console.log('Get campaigns error:', error);
    return c.json({ error: error.message }, 401);
  }
});

app.post('/make-server-5efafb23/campaigns', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const campaignData = await c.req.json();

    const campaign: CampaignRecord = {
      id: `camp_${Date.now()}`,
      ...campaignData,
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    const created = await db.createCampaign(campaign);

    return c.json(created);
  } catch (error) {
    console.log('Create campaign error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Dashboard Data Routes
app.get('/make-server-5efafb23/dashboard/metrics', async (c) => {
  try {
    await getUser(c.req.raw);

    // Mock metrics - in real app, aggregate from campaign data
    const metrics = {
      totalSpend: 124500,
      tokensUsed: 8500,
      tokensLimit: 10000,
      activeCampaigns: 24,
      conversions: 1847,
      lastUpdated: new Date().toISOString(),
    };

    return c.json(metrics);
  } catch (error) {
    console.log('Get metrics error:', error);
    return c.json({ error: error.message }, 401);
  }
});

// Admin Client Management Routes
app.get('/make-server-5efafb23/admin/clients', async (c) => {
  try {
    await getUser(c.req.raw);

    const clients = await db.listClients();

    return c.json(clients);
  } catch (error) {
    console.log('Get clients error:', error);
    return c.json({ error: error.message }, 401);
  }
});

app.post('/make-server-5efafb23/admin/clients', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const clientData = await c.req.json();

    // Generate unique client ID
    const clientId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;

    const client: ClientRecord = {
      id: clientId,
      ...clientData,
      status: 'trial',
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      tokensUsed: 0,
      tokensLimit: clientData.plan === 'Starter' ? 2500 : clientData.plan === 'Pro' ? 10000 : 25000,
      monthlySpend: 0,
      campaigns: 0,
      connectedAccounts: [],
    } as ClientRecord;

    const storedClient = await db.createClient(client);
    await db.addAdminClient(user.id, clientId);

    return c.json(storedClient);
  } catch (error) {
    console.log('Create client error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-5efafb23/admin/clients/:clientId', async (c) => {
  try {
    await getUser(c.req.raw);
    const { clientId } = c.req.param();

    const client = await db.getClient(clientId);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }

    return c.json(client);
  } catch (error) {
    console.log('Get client error:', error);
    return c.json({ error: error.message }, 401);
  }
});

app.put('/make-server-5efafb23/admin/clients/:clientId', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { clientId } = c.req.param();
    const updateData = await c.req.json();

    const updatedClient = await db.updateClient(clientId, {
      ...updateData,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
    } as Partial<ClientRecord>);

    if (!updatedClient) {
      return c.json({ error: 'Client not found' }, 404);
    }

    return c.json(updatedClient);
  } catch (error) {
    console.log('Update client error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete('/make-server-5efafb23/admin/clients/:clientId', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { clientId } = c.req.param();

    await db.deleteClient(clientId);
    await db.removeAdminClient(user.id, clientId);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete client error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Client OAuth Integration Management
app.post('/make-server-5efafb23/admin/clients/:clientId/oauth/:platform', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { clientId, platform } = c.req.param();
    const oauthData = await c.req.json();

    const client = await db.getClient(clientId);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }

    const connectedAccounts = Array.isArray(client.connectedAccounts)
      ? [...client.connectedAccounts]
      : [];
    if (!connectedAccounts.includes(platform)) {
      connectedAccounts.push(platform);
    }

    await db.updateClient(clientId, {
      connectedAccounts,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
    } as Partial<ClientRecord>);

    await db.saveClientOAuth(clientId, platform, {
      ...oauthData,
      connectedAt: new Date().toISOString(),
      connectedBy: user.id,
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('OAuth connection error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete('/make-server-5efafb23/admin/clients/:clientId/oauth/:platform', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { clientId, platform } = c.req.param();

    const client = await db.getClient(clientId);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }

    const connectedAccounts = Array.isArray(client.connectedAccounts)
      ? client.connectedAccounts.filter((p: string) => p !== platform)
      : [];

    await db.updateClient(clientId, {
      connectedAccounts,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
    } as Partial<ClientRecord>);

    await db.deleteClientOAuth(clientId, platform);

    return c.json({ success: true });
  } catch (error) {
    console.log('OAuth disconnection error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Client Campaign Management
app.get('/make-server-5efafb23/admin/clients/:clientId/campaigns', async (c) => {
  try {
    await getUser(c.req.raw);
    const { clientId } = c.req.param();

    const campaigns = await db.listClientCampaigns(clientId);
    return c.json(campaigns);
  } catch (error) {
    console.log('Get client campaigns error:', error);
    return c.json({ error: error.message }, 401);
  }
});

// Client Billing and Token Management
app.post('/make-server-5efafb23/admin/clients/:clientId/tokens', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { clientId } = c.req.param();
    const { tokensUsed, cost } = await c.req.json();

    const client = await db.getClient(clientId);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }

    const updatedClient = await db.updateClient(clientId, {
      tokensUsed: Number(client.tokensUsed ?? 0) + Number(tokensUsed ?? 0),
      monthlySpend: Number(client.monthlySpend ?? 0) + Number(cost ?? 0),
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
    } as Partial<ClientRecord>);

    const billingEntry: BillingEntry = {
      timestamp: new Date().toISOString(),
      tokensUsed,
      cost,
      adminId: user.id,
    };
    await db.appendBillingEntry(clientId, billingEntry);

    return c.json({ success: true, client: updatedClient });
  } catch (error) {
    console.log('Token billing error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Admin Analytics and Reporting
app.get('/make-server-5efafb23/admin/analytics', async (c) => {
  try {
    await getUser(c.req.raw);

    const clients = await db.listClients();

    const analytics = {
      totalClients: clients.length,
      activeClients: clients.filter((client) => client.status === 'active').length,
      totalRevenue: clients.reduce((sum, client) => sum + Number(client.monthlySpend ?? 0), 0),
      totalTokensUsed: clients.reduce((sum, client) => sum + Number(client.tokensUsed ?? 0), 0),
      totalCampaigns: clients.reduce((sum, client) => sum + Number(client.campaigns ?? 0), 0),
      clientStatusDistribution: {
        active: clients.filter((client) => client.status === 'active').length,
        trial: clients.filter((client) => client.status === 'trial').length,
        paused: clients.filter((client) => client.status === 'paused').length,
        cancelled: clients.filter((client) => client.status === 'cancelled').length,
      },
      topClients: clients
        .slice()
        .sort((a, b) => Number(b.monthlySpend ?? 0) - Number(a.monthlySpend ?? 0))
        .slice(0, 5)
        .map((client) => ({
          id: client.id,
          name: client.name,
          monthlySpend: Number(client.monthlySpend ?? 0),
          tokensUsed: Number(client.tokensUsed ?? 0),
        })),
    };

    return c.json(analytics);
  } catch (error) {
    console.log('Get analytics error:', error);
    return c.json({ error: error.message }, 401);
  }
});

// Helper functions for testing integrations
async function testOpenAI(apiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { success: true, message: 'OpenAI connection successful' };
    } else {
      return { success: false, message: 'OpenAI API key invalid' };
    }
  } catch (error) {
    return { success: false, message: `OpenAI test failed: ${error.message}` };
  }
}

async function testAnthropic(apiKey: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });

    if (response.ok || response.status === 400) {
      return { success: true, message: 'Anthropic connection successful' };
    } else {
      return { success: false, message: 'Anthropic API key invalid' };
    }
  } catch (error) {
    return { success: false, message: `Anthropic test failed: ${error.message}` };
  }
}

async function testGoogleAI(apiKey: string) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);

    if (response.ok) {
      return { success: true, message: 'Google AI connection successful' };
    } else {
      return { success: false, message: 'Google AI API key invalid' };
    }
  } catch (error) {
    return { success: false, message: `Google AI test failed: ${error.message}` };
  }
}

// Health check
app.get('/make-server-5efafb23/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
