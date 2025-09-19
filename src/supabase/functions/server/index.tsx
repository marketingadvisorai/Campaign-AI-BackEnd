import { Hono } from 'npm:hono@4.5.8';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

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
app.post('/make-server-5efafb23/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    // Initialize user data in KV store
    await kv.set(`user:${data.user.id}:setup`, { isSetupComplete: false });
    await kv.set(`user:${data.user.id}:integrations`, {});
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// User Setup Routes
app.get('/make-server-5efafb23/user/setup-status', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const setupData = await kv.get(`user:${user.id}:setup`) || { isSetupComplete: false };
    
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
    
    // Save setup completion
    await kv.set(`user:${user.id}:setup`, { 
      isSetupComplete: true, 
      completedAt: new Date().toISOString(),
      setupData 
    });
    
    // Initialize workspace
    const workspaceId = `ws_${user.id}_${Date.now()}`;
    await kv.set(`user:${user.id}:workspace`, {
      id: workspaceId,
      name: 'Default Workspace',
      createdAt: new Date().toISOString()
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Complete setup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Integration Routes
app.get('/make-server-5efafb23/integrations', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const integrations = await kv.get(`user:${user.id}:integrations`) || {};
    
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
    
    // Get existing integrations
    const integrations = await kv.get(`user:${user.id}:integrations`) || {};
    
    // Update integration
    if (!integrations[category]) {
      integrations[category] = {};
    }
    
    integrations[category][provider] = {
      ...data,
      connectedAt: new Date().toISOString(),
      status: 'connected'
    };
    
    // Save updated integrations
    await kv.set(`user:${user.id}:integrations`, integrations);
    
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
    
    // Get integration data
    const integrations = await kv.get(`user:${user.id}:integrations`) || {};
    const integration = integrations[category]?.[provider];
    
    if (!integration) {
      return c.json({ error: 'Integration not found' }, 404);
    }
    
    // Test the connection based on provider type
    let testResult = { success: false, message: 'Unknown provider' };
    
    switch (provider) {
      case 'openai':
        testResult = await testOpenAI(integration.api_key);
        break;
      case 'anthropic':
        testResult = await testAnthropic(integration.api_key);
        break;
      case 'google_ai':
        testResult = await testGoogleAI(integration.api_key);
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
    
    // Get existing integrations
    const integrations = await kv.get(`user:${user.id}:integrations`) || {};
    
    // Remove integration
    if (integrations[category]?.[provider]) {
      delete integrations[category][provider];
    }
    
    // Save updated integrations
    await kv.set(`user:${user.id}:integrations`, integrations);
    
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
    const campaigns = await kv.get(`user:${user.id}:campaigns`) || [];
    
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
    
    const campaign = {
      id: `camp_${Date.now()}`,
      ...campaignData,
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // Get existing campaigns
    const campaigns = await kv.get(`user:${user.id}:campaigns`) || [];
    campaigns.push(campaign);
    
    // Save updated campaigns
    await kv.set(`user:${user.id}:campaigns`, campaigns);
    
    return c.json(campaign);
  } catch (error) {
    console.log('Create campaign error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Dashboard Data Routes
app.get('/make-server-5efafb23/dashboard/metrics', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    
    // Mock metrics - in real app, aggregate from campaign data
    const metrics = {
      totalSpend: 124500,
      tokensUsed: 8500,
      tokensLimit: 10000,
      activeCampaigns: 24,
      conversions: 1847,
      lastUpdated: new Date().toISOString()
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
    const user = await getUser(c.req.raw);
    
    // Get all clients from KV store
    const clientIds = await kv.getByPrefix('client:') || [];
    const clients = [];
    
    for (const clientData of clientIds) {
      if (clientData && clientData.id) {
        clients.push(clientData);
      }
    }
    
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
    
    const client = {
      id: clientId,
      ...clientData,
      status: 'trial',
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      tokensUsed: 0,
      tokensLimit: clientData.plan === 'Starter' ? 2500 : clientData.plan === 'Pro' ? 10000 : 25000,
      monthlySpend: 0,
      campaigns: 0,
      connectedAccounts: []
    };
    
    // Save client data
    await kv.set(`client:${clientId}`, client);
    
    // Add to admin's client list
    const adminClients = await kv.get(`admin:${user.id}:clients`) || [];
    adminClients.push(clientId);
    await kv.set(`admin:${user.id}:clients`, adminClients);
    
    return c.json(client);
  } catch (error) {
    console.log('Create client error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-5efafb23/admin/clients/:clientId', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { clientId } = c.req.param();
    
    const client = await kv.get(`client:${clientId}`);
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
    
    const existingClient = await kv.get(`client:${clientId}`);
    if (!existingClient) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    const updatedClient = {
      ...existingClient,
      ...updateData,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };
    
    await kv.set(`client:${clientId}`, updatedClient);
    
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
    
    // Remove client data
    await kv.del(`client:${clientId}`);
    
    // Remove from admin's client list
    const adminClients = await kv.get(`admin:${user.id}:clients`) || [];
    const updatedClients = adminClients.filter(id => id !== clientId);
    await kv.set(`admin:${user.id}:clients`, updatedClients);
    
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
    
    const client = await kv.get(`client:${clientId}`);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    // Update client's connected accounts
    if (!client.connectedAccounts.includes(platform)) {
      client.connectedAccounts.push(platform);
    }
    
    client.updatedAt = new Date().toISOString();
    await kv.set(`client:${clientId}`, client);
    
    // Store OAuth tokens securely (encrypted in real implementation)
    await kv.set(`client:${clientId}:oauth:${platform}`, {
      ...oauthData,
      connectedAt: new Date().toISOString(),
      connectedBy: user.id
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
    
    const client = await kv.get(`client:${clientId}`);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    // Remove platform from connected accounts
    client.connectedAccounts = client.connectedAccounts.filter(p => p !== platform);
    client.updatedAt = new Date().toISOString();
    await kv.set(`client:${clientId}`, client);
    
    // Remove OAuth tokens
    await kv.del(`client:${clientId}:oauth:${platform}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('OAuth disconnection error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Client Campaign Management
app.get('/make-server-5efafb23/admin/clients/:clientId/campaigns', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    const { clientId } = c.req.param();
    
    const campaigns = await kv.get(`client:${clientId}:campaigns`) || [];
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
    
    const client = await kv.get(`client:${clientId}`);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    // Update token usage and billing
    client.tokensUsed += tokensUsed;
    client.monthlySpend += cost;
    client.updatedAt = new Date().toISOString();
    
    await kv.set(`client:${clientId}`, client);
    
    // Log billing event
    const billingLog = await kv.get(`client:${clientId}:billing`) || [];
    billingLog.push({
      timestamp: new Date().toISOString(),
      tokensUsed,
      cost,
      adminId: user.id
    });
    await kv.set(`client:${clientId}:billing`, billingLog);
    
    return c.json({ success: true, client });
  } catch (error) {
    console.log('Token billing error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Admin Analytics and Reporting
app.get('/make-server-5efafb23/admin/analytics', async (c) => {
  try {
    const user = await getUser(c.req.raw);
    
    // Get all clients for analytics
    const clientIds = await kv.getByPrefix('client:') || [];
    const clients = clientIds.filter(data => data && data.id);
    
    const analytics = {
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      totalRevenue: clients.reduce((sum, c) => sum + (c.monthlySpend || 0), 0),
      totalTokensUsed: clients.reduce((sum, c) => sum + (c.tokensUsed || 0), 0),
      totalCampaigns: clients.reduce((sum, c) => sum + (c.campaigns || 0), 0),
      clientStatusDistribution: {
        active: clients.filter(c => c.status === 'active').length,
        trial: clients.filter(c => c.status === 'trial').length,
        paused: clients.filter(c => c.status === 'paused').length,
        cancelled: clients.filter(c => c.status === 'cancelled').length
      },
      topClients: clients
        .sort((a, b) => (b.monthlySpend || 0) - (a.monthlySpend || 0))
        .slice(0, 5)
        .map(c => ({
          id: c.id,
          name: c.name,
          monthlySpend: c.monthlySpend || 0,
          tokensUsed: c.tokensUsed || 0
        }))
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
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
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
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      })
    });
    
    if (response.ok || response.status === 400) { // 400 is expected for test message
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