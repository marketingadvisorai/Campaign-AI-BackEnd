import { Client } from 'npm:@planetscale/database';
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

function parseJSON<T>(value: unknown): T | null {
  if (value == null) {
    return null;
  }
  if (typeof value === 'object') {
    return value as T;
  }
  try {
    return JSON.parse(String(value)) as T;
  } catch (_error) {
    return null;
  }
}

function serializeJSON(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function toISO(value: unknown): string {
  if (value == null) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  const str = String(value);
  return str;
}

export class MySQLAdapter implements DatabaseAdapter {
  private client: Client;

  constructor() {
    const host = Deno.env.get('PLANETSCALE_HOST');
    const username = Deno.env.get('PLANETSCALE_USERNAME');
    const password = Deno.env.get('PLANETSCALE_PASSWORD');
    if (!host || !username || !password) {
      throw new Error('PLANETSCALE_HOST, PLANETSCALE_USERNAME, and PLANETSCALE_PASSWORD must be set for MySQLAdapter');
    }

    const database = Deno.env.get('PLANETSCALE_DATABASE');
    const config: Record<string, unknown> = { host, username, password };
    if (database) {
      config['database'] = database;
    }

    this.client = new Client(config);
  }

  private async execute<T = any>(sql: string, params: unknown[] = []) {
    return this.client.execute<T>(sql, params as any);
  }

  private mapUser(row: Record<string, any>): UserRecord {
    return {
      id: row.id,
      email: row.email,
      name: row.name ?? null,
      passwordHash: row.password_hash,
      createdAt: toISO(row.created_at),
    };
  }

  async createUser(user: CreateUserInput): Promise<UserRecord> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await this.execute(
      `INSERT INTO users (id, email, password_hash, name, created_at)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name), created_at = VALUES(created_at)`,
      [id, user.email.toLowerCase(), user.passwordHash, user.name ?? null, createdAt],
    );
    const stored = await this.getUserByEmail(user.email);
    if (!stored) {
      throw new Error('Failed to persist user record');
    }
    return stored;
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.execute(
      `SELECT id, email, password_hash, name, created_at FROM users WHERE email = ? LIMIT 1`,
      [email.toLowerCase()],
    );
    if (!result.rows?.length) {
      return null;
    }
    return this.mapUser(result.rows[0] as Record<string, any>);
  }

  async getUserById(userId: string): Promise<UserRecord | null> {
    const result = await this.execute(
      `SELECT id, email, password_hash, name, created_at FROM users WHERE id = ? LIMIT 1`,
      [userId],
    );
    if (!result.rows?.length) {
      return null;
    }
    return this.mapUser(result.rows[0] as Record<string, any>);
  }

  async getUserSetup(userId: string): Promise<UserSetupRecord | null> {
    const result = await this.execute(
      `SELECT is_setup_complete, completed_at, setup_data FROM user_setup WHERE user_id = ? LIMIT 1`,
      [userId],
    );
    if (!result.rows?.length) {
      return null;
    }
    const row = result.rows[0] as Record<string, any>;
    return {
      isSetupComplete: Boolean(row.is_setup_complete),
      completedAt: row.completed_at ? toISO(row.completed_at) : null,
      setupData: parseJSON<Record<string, unknown>>(row.setup_data),
    };
  }

  async saveUserSetup(userId: string, data: UserSetupRecord): Promise<void> {
    await this.execute(
      `INSERT INTO user_setup (user_id, is_setup_complete, completed_at, setup_data)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE is_setup_complete = VALUES(is_setup_complete), completed_at = VALUES(completed_at), setup_data = VALUES(setup_data)`,
      [userId, data.isSetupComplete ? 1 : 0, data.completedAt ?? null, serializeJSON(data.setupData ?? null)],
    );
  }

  async getUserWorkspace(userId: string): Promise<WorkspaceRecord | null> {
    const result = await this.execute(`SELECT workspace FROM user_workspace WHERE user_id = ? LIMIT 1`, [userId]);
    if (!result.rows?.length) {
      return null;
    }
    return parseJSON<WorkspaceRecord>((result.rows[0] as Record<string, any>).workspace);
  }

  async saveUserWorkspace(userId: string, workspace: WorkspaceRecord): Promise<void> {
    await this.execute(
      `INSERT INTO user_workspace (user_id, workspace)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE workspace = VALUES(workspace)`,
      [userId, serializeJSON(workspace)],
    );
  }

  async listUserIntegrations(userId: string): Promise<IntegrationMap> {
    const result = await this.execute(
      `SELECT category, provider, data FROM user_integrations WHERE user_id = ?`,
      [userId],
    );
    const integrations: IntegrationMap = {};
    for (const rawRow of result.rows as Record<string, any>[]) {
      const category = rawRow.category as string;
      const provider = rawRow.provider as string;
      if (!integrations[category]) {
        integrations[category] = {};
      }
      integrations[category][provider] = parseJSON<Record<string, unknown>>(rawRow.data) ?? {};
    }
    return integrations;
  }

  async getUserIntegration(userId: string, category: string, provider: string): Promise<Record<string, unknown> | null> {
    const result = await this.execute(
      `SELECT data FROM user_integrations WHERE user_id = ? AND category = ? AND provider = ? LIMIT 1`,
      [userId, category, provider],
    );
    if (!result.rows?.length) {
      return null;
    }
    return parseJSON<Record<string, unknown>>((result.rows[0] as Record<string, any>).data);
  }

  async upsertUserIntegration(record: IntegrationRecord): Promise<void> {
    await this.execute(
      `INSERT INTO user_integrations (user_id, category, provider, data)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [record.userId, record.category, record.provider, serializeJSON(record.data)],
    );
  }

  async deleteUserIntegration(userId: string, category: string, provider: string): Promise<void> {
    await this.execute(`DELETE FROM user_integrations WHERE user_id = ? AND category = ? AND provider = ?`, [userId, category, provider]);
  }

  async listCampaigns(userId: string): Promise<CampaignRecord[]> {
    const result = await this.execute(
      `SELECT id, user_id, created_at, payload FROM campaigns WHERE user_id = ? ORDER BY created_at ASC`,
      [userId],
    );
    return (result.rows as Record<string, any>[]).map((row) => {
      const payload = parseJSON<Record<string, unknown>>(row.payload) ?? {};
      return {
        ...payload,
        id: row.id,
        userId: row.user_id,
        createdAt: toISO(row.created_at),
      } as CampaignRecord;
    });
  }

  async createCampaign(campaign: CampaignRecord): Promise<CampaignRecord> {
    await this.execute(
      `INSERT INTO campaigns (id, user_id, created_at, payload)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE payload = VALUES(payload), created_at = VALUES(created_at)`,
      [campaign.id, campaign.userId, campaign.createdAt, serializeJSON(campaign)],
    );
    const stored = await this.execute(`SELECT id, user_id, created_at, payload FROM campaigns WHERE id = ? LIMIT 1`, [campaign.id]);
    const row = stored.rows?.[0] as Record<string, any>;
    const payload = parseJSON<Record<string, unknown>>(row?.payload) ?? {};
    return {
      ...payload,
      id: row.id,
      userId: row.user_id,
      createdAt: toISO(row.created_at),
    } as CampaignRecord;
  }

  async listClients(): Promise<ClientRecord[]> {
    const result = await this.execute(`SELECT id, created_at, payload FROM clients ORDER BY created_at ASC`);
    return (result.rows as Record<string, any>[]).map((row) => {
      const payload = parseJSON<Record<string, unknown>>(row.payload) ?? {};
      return {
        ...payload,
        id: row.id,
        createdAt: toISO(row.created_at),
      } as ClientRecord;
    });
  }

  async createClient(client: ClientRecord): Promise<ClientRecord> {
    const createdAt = client.createdAt ?? new Date().toISOString();
    const payload = { ...client, createdAt };
    await this.execute(
      `INSERT INTO clients (id, created_at, payload)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE payload = VALUES(payload), created_at = VALUES(created_at)`,
      [client.id, createdAt, serializeJSON(payload)],
    );
    const stored = await this.getClient(client.id);
    if (!stored) {
      throw new Error('Failed to persist client record');
    }
    return stored;
  }

  async getClient(clientId: string): Promise<ClientRecord | null> {
    const result = await this.execute(`SELECT id, created_at, payload FROM clients WHERE id = ? LIMIT 1`, [clientId]);
    if (!result.rows?.length) {
      return null;
    }
    const row = result.rows[0] as Record<string, any>;
    const payload = parseJSON<Record<string, unknown>>(row.payload) ?? {};
    return { ...payload, id: row.id, createdAt: toISO(row.created_at) } as ClientRecord;
  }

  async updateClient(clientId: string, updates: Partial<ClientRecord>): Promise<ClientRecord | null> {
    const existing = await this.getClient(clientId);
    if (!existing) {
      return null;
    }
    const merged = { ...existing, ...updates, id: clientId } as ClientRecord;
    await this.execute(`UPDATE clients SET payload = ? WHERE id = ?`, [serializeJSON(merged), clientId]);
    return merged;
  }

  async deleteClient(clientId: string): Promise<void> {
    await this.execute(`DELETE FROM client_oauth WHERE client_id = ?`, [clientId]);
    await this.execute(`DELETE FROM client_billing WHERE client_id = ?`, [clientId]);
    await this.execute(`DELETE FROM client_campaigns WHERE client_id = ?`, [clientId]);
    await this.execute(`DELETE FROM admin_clients WHERE client_id = ?`, [clientId]);
    await this.execute(`DELETE FROM clients WHERE id = ?`, [clientId]);
  }

  async addAdminClient(adminId: string, clientId: string): Promise<void> {
    await this.execute(
      `INSERT IGNORE INTO admin_clients (admin_id, client_id) VALUES (?, ?)`,
      [adminId, clientId],
    );
  }

  async removeAdminClient(adminId: string, clientId: string): Promise<void> {
    await this.execute(`DELETE FROM admin_clients WHERE admin_id = ? AND client_id = ?`, [adminId, clientId]);
  }

  async saveClientOAuth(clientId: string, platform: string, data: ClientOAuthRecord): Promise<void> {
    await this.execute(
      `INSERT INTO client_oauth (client_id, platform, data)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [clientId, platform, serializeJSON(data)],
    );
  }

  async deleteClientOAuth(clientId: string, platform: string): Promise<void> {
    await this.execute(`DELETE FROM client_oauth WHERE client_id = ? AND platform = ?`, [clientId, platform]);
  }

  async listClientCampaigns(clientId: string): Promise<ClientCampaignRecord[]> {
    const result = await this.execute(`SELECT id, client_id, payload FROM client_campaigns WHERE client_id = ?`, [clientId]);
    return (result.rows as Record<string, any>[]).map((row) => {
      const payload = parseJSON<Record<string, unknown>>(row.payload) ?? {};
      return { ...payload, id: row.id, clientId: row.client_id } as ClientCampaignRecord;
    });
  }

  async saveClientCampaigns(clientId: string, campaigns: ClientCampaignRecord[]): Promise<void> {
    await this.execute(`DELETE FROM client_campaigns WHERE client_id = ?`, [clientId]);
    for (const campaign of campaigns) {
      await this.execute(
        `INSERT INTO client_campaigns (id, client_id, payload)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE payload = VALUES(payload)`,
        [campaign.id, clientId, serializeJSON(campaign)],
      );
    }
  }

  async appendBillingEntry(clientId: string, entry: BillingEntry): Promise<void> {
    await this.execute(
      `INSERT INTO client_billing (client_id, timestamp, tokens_used, cost, admin_id)
       VALUES (?, ?, ?, ?, ?)`,
      [clientId, entry.timestamp, entry.tokensUsed, entry.cost, entry.adminId],
    );
  }

  async listBillingEntries(clientId: string): Promise<BillingEntry[]> {
    const result = await this.execute(
      `SELECT timestamp, tokens_used, cost, admin_id FROM client_billing WHERE client_id = ? ORDER BY timestamp ASC`,
      [clientId],
    );
    return (result.rows as Record<string, any>[]).map((row) => ({
      timestamp: toISO(row.timestamp),
      tokensUsed: Number(row.tokens_used ?? 0),
      cost: Number(row.cost ?? 0),
      adminId: row.admin_id,
    }));
  }
}
