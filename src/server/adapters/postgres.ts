import { Pool } from 'npm:@neondatabase/serverless';
import {
  BillingEntry,
  CampaignRecord,
  ClientCampaignRecord,
  ClientOAuthRecord,
  ClientRecord,
  CreateUserInput,
  DatabaseAdapter,
  IntegrationMap,
  IntegrationRecord,
  UserRecord,
  UserSetupRecord,
  WorkspaceRecord,
} from './database.ts';

function buildConnectionString(url: string, password?: string): string {
  if (!password) {
    return url;
  }

  const parsed = new URL(url);
  if (!parsed.password) {
    parsed.password = password;
  }
  return parsed.toString();
}

export class PostgresAdapter implements DatabaseAdapter {
  private pool: Pool;

  constructor() {
    const url = Deno.env.get('POSTGRES_URL');
    if (!url) {
      throw new Error('POSTGRES_URL environment variable is required for PostgresAdapter');
    }
    const password = Deno.env.get('POSTGRES_PASSWORD') ?? undefined;
    this.pool = new Pool({ connectionString: buildConnectionString(url, password) });
  }

  private async query<T = Record<string, unknown>>(text: string, params: unknown[] = []) {
    return this.pool.query<T>(text, params);
  }

  private mapUser(row: Record<string, any>): UserRecord {
    return {
      id: row.id,
      email: row.email,
      name: row.name ?? null,
      passwordHash: row.password_hash,
      createdAt: typeof row.created_at === 'string' ? row.created_at : row.created_at?.toISOString?.() ?? '',
    };
  }

  async createUser(user: CreateUserInput): Promise<UserRecord> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const result = await this.query(
      `INSERT INTO users (id, email, password_hash, name, created_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           name = EXCLUDED.name,
           created_at = EXCLUDED.created_at
       RETURNING id, email, password_hash, name, created_at`,
      [id, user.email.toLowerCase(), user.passwordHash, user.name ?? null, createdAt],
    );
    return this.mapUser(result.rows[0] as Record<string, any>);
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.query(
      `SELECT id, email, password_hash, name, created_at FROM users WHERE email = $1 LIMIT 1`,
      [email.toLowerCase()],
    );
    if (!result.rows.length) {
      return null;
    }
    return this.mapUser(result.rows[0] as Record<string, any>);
  }

  async getUserById(userId: string): Promise<UserRecord | null> {
    const result = await this.query(
      `SELECT id, email, password_hash, name, created_at FROM users WHERE id = $1 LIMIT 1`,
      [userId],
    );
    if (!result.rows.length) {
      return null;
    }
    return this.mapUser(result.rows[0] as Record<string, any>);
  }

  async getUserSetup(userId: string): Promise<UserSetupRecord | null> {
    const result = await this.query(
      `SELECT is_setup_complete, completed_at, setup_data
         FROM user_setup WHERE user_id = $1`,
      [userId],
    );
    if (!result.rows.length) {
      return null;
    }
    const row = result.rows[0] as Record<string, any>;
    return {
      isSetupComplete: row.is_setup_complete,
      completedAt: row.completed_at ? (typeof row.completed_at === 'string' ? row.completed_at : row.completed_at.toISOString?.()) : null,
      setupData: row.setup_data ?? null,
    };
  }

  async saveUserSetup(userId: string, data: UserSetupRecord): Promise<void> {
    await this.query(
      `INSERT INTO user_setup (user_id, is_setup_complete, completed_at, setup_data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE
       SET is_setup_complete = EXCLUDED.is_setup_complete,
           completed_at = EXCLUDED.completed_at,
           setup_data = EXCLUDED.setup_data`,
      [userId, data.isSetupComplete, data.completedAt ?? null, data.setupData ?? null],
    );
  }

  async getUserWorkspace(userId: string): Promise<WorkspaceRecord | null> {
    const result = await this.query(
      `SELECT workspace FROM user_workspace WHERE user_id = $1 LIMIT 1`,
      [userId],
    );
    if (!result.rows.length) {
      return null;
    }
    return result.rows[0].workspace as WorkspaceRecord;
  }

  async saveUserWorkspace(userId: string, workspace: WorkspaceRecord): Promise<void> {
    await this.query(
      `INSERT INTO user_workspace (user_id, workspace)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE
       SET workspace = EXCLUDED.workspace`,
      [userId, workspace],
    );
  }

  async listUserIntegrations(userId: string): Promise<IntegrationMap> {
    const result = await this.query(
      `SELECT category, provider, data FROM user_integrations WHERE user_id = $1`,
      [userId],
    );
    const integrations: IntegrationMap = {};
    for (const row of result.rows as Record<string, any>[]) {
      const category = row.category as string;
      const provider = row.provider as string;
      if (!integrations[category]) {
        integrations[category] = {};
      }
      integrations[category][provider] = row.data ?? {};
    }
    return integrations;
  }

  async getUserIntegration(userId: string, category: string, provider: string): Promise<Record<string, unknown> | null> {
    const result = await this.query(
      `SELECT data FROM user_integrations WHERE user_id = $1 AND category = $2 AND provider = $3 LIMIT 1`,
      [userId, category, provider],
    );
    if (!result.rows.length) {
      return null;
    }
    return result.rows[0].data as Record<string, unknown>;
  }

  async upsertUserIntegration(record: IntegrationRecord): Promise<void> {
    await this.query(
      `INSERT INTO user_integrations (user_id, category, provider, data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, category, provider) DO UPDATE
       SET data = EXCLUDED.data`,
      [record.userId, record.category, record.provider, record.data],
    );
  }

  async deleteUserIntegration(userId: string, category: string, provider: string): Promise<void> {
    await this.query(
      `DELETE FROM user_integrations WHERE user_id = $1 AND category = $2 AND provider = $3`,
      [userId, category, provider],
    );
  }

  async listCampaigns(userId: string): Promise<CampaignRecord[]> {
    const result = await this.query(
      `SELECT id, user_id, created_at, payload FROM campaigns WHERE user_id = $1 ORDER BY created_at ASC`,
      [userId],
    );
    return (result.rows as Record<string, any>[]).map((row) => {
      const payload = (row.payload ?? {}) as Record<string, unknown>;
      return {
        ...payload,
        id: row.id,
        userId: row.user_id,
        createdAt: typeof row.created_at === 'string' ? row.created_at : row.created_at?.toISOString?.() ?? '',
      };
    });
  }

  async createCampaign(campaign: CampaignRecord): Promise<CampaignRecord> {
    const result = await this.query(
      `INSERT INTO campaigns (id, user_id, created_at, payload)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload
       RETURNING id, user_id, created_at, payload`,
      [campaign.id, campaign.userId, campaign.createdAt, campaign],
    );
    const row = result.rows[0] as Record<string, any>;
    const payload = (row.payload ?? {}) as Record<string, unknown>;
    return {
      ...payload,
      id: row.id,
      userId: row.user_id,
      createdAt: typeof row.created_at === 'string' ? row.created_at : row.created_at?.toISOString?.() ?? campaign.createdAt,
    } as CampaignRecord;
  }

  async listClients(): Promise<ClientRecord[]> {
    const result = await this.query(`SELECT id, created_at, payload FROM clients ORDER BY created_at ASC`);
    return (result.rows as Record<string, any>[]).map((row) => {
      const payload = (row.payload ?? {}) as Record<string, unknown>;
      const createdAt = typeof row.created_at === 'string' ? row.created_at : row.created_at?.toISOString?.() ?? '';
      return { ...payload, id: row.id, createdAt } as ClientRecord;
    });
  }

  async createClient(client: ClientRecord): Promise<ClientRecord> {
    const createdAt = client.createdAt ?? new Date().toISOString();
    const payload = { ...client, createdAt };
    const result = await this.query(
      `INSERT INTO clients (id, created_at, payload)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload
       RETURNING id, created_at, payload`,
      [client.id, createdAt, payload],
    );
    const row = result.rows[0] as Record<string, any>;
    const storedPayload = (row.payload ?? {}) as Record<string, unknown>;
    const rowCreatedAt = typeof row.created_at === 'string' ? row.created_at : row.created_at?.toISOString?.() ?? createdAt;
    return { ...storedPayload, id: row.id, createdAt: rowCreatedAt } as ClientRecord;
  }

  async getClient(clientId: string): Promise<ClientRecord | null> {
    const result = await this.query(
      `SELECT id, created_at, payload FROM clients WHERE id = $1 LIMIT 1`,
      [clientId],
    );
    if (!result.rows.length) {
      return null;
    }
    const row = result.rows[0] as Record<string, any>;
    const payload = (row.payload ?? {}) as Record<string, unknown>;
    const createdAt = typeof row.created_at === 'string' ? row.created_at : row.created_at?.toISOString?.() ?? '';
    return { ...payload, id: row.id, createdAt } as ClientRecord;
  }

  async updateClient(clientId: string, updates: Partial<ClientRecord>): Promise<ClientRecord | null> {
    const existing = await this.getClient(clientId);
    if (!existing) {
      return null;
    }
    const merged = { ...existing, ...updates, id: clientId } as ClientRecord;
    await this.query(`UPDATE clients SET payload = $2 WHERE id = $1`, [clientId, merged]);
    return merged;
  }

  async deleteClient(clientId: string): Promise<void> {
    await this.query(`DELETE FROM client_oauth WHERE client_id = $1`, [clientId]);
    await this.query(`DELETE FROM client_billing WHERE client_id = $1`, [clientId]);
    await this.query(`DELETE FROM client_campaigns WHERE client_id = $1`, [clientId]);
    await this.query(`DELETE FROM admin_clients WHERE client_id = $1`, [clientId]);
    await this.query(`DELETE FROM clients WHERE id = $1`, [clientId]);
  }

  async addAdminClient(adminId: string, clientId: string): Promise<void> {
    await this.query(
      `INSERT INTO admin_clients (admin_id, client_id)
       VALUES ($1, $2)
       ON CONFLICT (admin_id, client_id) DO NOTHING`,
      [adminId, clientId],
    );
  }

  async removeAdminClient(adminId: string, clientId: string): Promise<void> {
    await this.query(
      `DELETE FROM admin_clients WHERE admin_id = $1 AND client_id = $2`,
      [adminId, clientId],
    );
  }

  async saveClientOAuth(clientId: string, platform: string, data: ClientOAuthRecord): Promise<void> {
    await this.query(
      `INSERT INTO client_oauth (client_id, platform, data)
       VALUES ($1, $2, $3)
       ON CONFLICT (client_id, platform) DO UPDATE SET data = EXCLUDED.data`,
      [clientId, platform, data],
    );
  }

  async deleteClientOAuth(clientId: string, platform: string): Promise<void> {
    await this.query(
      `DELETE FROM client_oauth WHERE client_id = $1 AND platform = $2`,
      [clientId, platform],
    );
  }

  async listClientCampaigns(clientId: string): Promise<ClientCampaignRecord[]> {
    const result = await this.query(
      `SELECT id, client_id, payload FROM client_campaigns WHERE client_id = $1`,
      [clientId],
    );
    return (result.rows as Record<string, any>[]).map((row) => {
      const payload = (row.payload ?? {}) as Record<string, unknown>;
      return { ...payload, id: row.id, clientId: row.client_id } as ClientCampaignRecord;
    });
  }

  async saveClientCampaigns(clientId: string, campaigns: ClientCampaignRecord[]): Promise<void> {
    await this.query(`DELETE FROM client_campaigns WHERE client_id = $1`, [clientId]);
    for (const campaign of campaigns) {
      await this.query(
        `INSERT INTO client_campaigns (id, client_id, payload)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload`,
        [campaign.id, clientId, campaign],
      );
    }
  }

  async appendBillingEntry(clientId: string, entry: BillingEntry): Promise<void> {
    await this.query(
      `INSERT INTO client_billing (client_id, timestamp, tokens_used, cost, admin_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [clientId, entry.timestamp, entry.tokensUsed, entry.cost, entry.adminId],
    );
  }

  async listBillingEntries(clientId: string): Promise<BillingEntry[]> {
    const result = await this.query(
      `SELECT timestamp, tokens_used, cost, admin_id FROM client_billing WHERE client_id = $1 ORDER BY timestamp ASC`,
      [clientId],
    );
    return (result.rows as Record<string, any>[]).map((row) => ({
      timestamp: typeof row.timestamp === 'string' ? row.timestamp : row.timestamp?.toISOString?.() ?? '',
      tokensUsed: Number(row.tokens_used ?? 0),
      cost: Number(row.cost ?? 0),
      adminId: row.admin_id,
    }));
  }
}
