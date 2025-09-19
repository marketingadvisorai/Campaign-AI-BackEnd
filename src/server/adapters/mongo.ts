import { Collection, MongoClient } from 'npm:mongodb';
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

interface UserDocument {
  _id: string;
  email: string;
  name?: string | null;
  passwordHash: string;
  createdAt: string;
}

interface UserSetupDocument {
  userId: string;
  isSetupComplete: boolean;
  completedAt?: string | null;
  setupData?: Record<string, unknown> | null;
}

interface WorkspaceDocument {
  userId: string;
  workspace: WorkspaceRecord;
}

interface IntegrationDocument {
  userId: string;
  category: string;
  provider: string;
  data: Record<string, unknown>;
}

interface CampaignDocument {
  _id: string;
  userId: string;
  createdAt: string;
  payload: CampaignRecord;
}

interface ClientDocument {
  _id: string;
  createdAt: string;
  payload: ClientRecord;
}

interface AdminClientDocument {
  adminId: string;
  clientId: string;
}

interface ClientOAuthDocument {
  clientId: string;
  platform: string;
  data: ClientOAuthRecord;
}

interface ClientCampaignDocument {
  _id: string;
  clientId: string;
  payload: ClientCampaignRecord;
}

interface BillingDocument {
  clientId: string;
  timestamp: string;
  tokensUsed: number;
  cost: number;
  adminId: string;
}

export class MongoAdapter implements DatabaseAdapter {
  private client: MongoClient;
  private dbName: string;
  private ready: Promise<MongoClient>;

  constructor() {
    const uri = Deno.env.get('MONGODB_URI');
    if (!uri) {
      throw new Error('MONGODB_URI must be set for MongoAdapter');
    }
    this.dbName = Deno.env.get('MONGODB_DB') ?? 'campaign_ai';
    this.client = new MongoClient(uri);
    this.ready = this.client.connect();
  }

  private async collection<T>(name: string): Promise<Collection<T>> {
    const connection = await this.ready;
    return connection.db(this.dbName).collection<T>(name);
  }

  private mapUser(doc: UserDocument): UserRecord {
    return {
      id: doc._id,
      email: doc.email,
      name: doc.name ?? null,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt,
    };
  }

  async createUser(user: CreateUserInput): Promise<UserRecord> {
    const normalizedEmail = user.email.toLowerCase();
    const users = await this.collection<UserDocument>('users');
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await users.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          email: normalizedEmail,
          name: user.name ?? null,
          passwordHash: user.passwordHash,
        },
        $setOnInsert: {
          _id: id,
          createdAt,
        },
      },
      { upsert: true },
    );
    const stored = await users.findOne({ email: normalizedEmail });
    if (!stored) {
      throw new Error('Failed to persist user');
    }
    return this.mapUser(stored);
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const users = await this.collection<UserDocument>('users');
    const doc = await users.findOne({ email: email.toLowerCase() });
    return doc ? this.mapUser(doc) : null;
  }

  async getUserById(userId: string): Promise<UserRecord | null> {
    const users = await this.collection<UserDocument>('users');
    const doc = await users.findOne({ _id: userId });
    return doc ? this.mapUser(doc) : null;
  }

  async getUserSetup(userId: string): Promise<UserSetupRecord | null> {
    const setups = await this.collection<UserSetupDocument>('user_setup');
    const doc = await setups.findOne({ userId });
    if (!doc) {
      return null;
    }
    return {
      isSetupComplete: doc.isSetupComplete,
      completedAt: doc.completedAt ?? null,
      setupData: doc.setupData ?? null,
    };
  }

  async saveUserSetup(userId: string, data: UserSetupRecord): Promise<void> {
    const setups = await this.collection<UserSetupDocument>('user_setup');
    await setups.updateOne(
      { userId },
      {
        $set: {
          userId,
          isSetupComplete: data.isSetupComplete,
          completedAt: data.completedAt ?? null,
          setupData: data.setupData ?? null,
        },
      },
      { upsert: true },
    );
  }

  async getUserWorkspace(userId: string): Promise<WorkspaceRecord | null> {
    const workspaces = await this.collection<WorkspaceDocument>('user_workspace');
    const doc = await workspaces.findOne({ userId });
    return doc?.workspace ?? null;
  }

  async saveUserWorkspace(userId: string, workspace: WorkspaceRecord): Promise<void> {
    const workspaces = await this.collection<WorkspaceDocument>('user_workspace');
    await workspaces.updateOne(
      { userId },
      {
        $set: {
          userId,
          workspace,
        },
      },
      { upsert: true },
    );
  }

  async listUserIntegrations(userId: string): Promise<IntegrationMap> {
    const integrations = await this.collection<IntegrationDocument>('user_integrations');
    const docs = await integrations.find({ userId }).toArray();
    const map: IntegrationMap = {};
    for (const doc of docs) {
      if (!map[doc.category]) {
        map[doc.category] = {};
      }
      map[doc.category][doc.provider] = doc.data ?? {};
    }
    return map;
  }

  async getUserIntegration(userId: string, category: string, provider: string): Promise<Record<string, unknown> | null> {
    const integrations = await this.collection<IntegrationDocument>('user_integrations');
    const doc = await integrations.findOne({ userId, category, provider });
    return doc?.data ?? null;
  }

  async upsertUserIntegration(record: IntegrationRecord): Promise<void> {
    const integrations = await this.collection<IntegrationDocument>('user_integrations');
    await integrations.updateOne(
      { userId: record.userId, category: record.category, provider: record.provider },
      {
        $set: {
          userId: record.userId,
          category: record.category,
          provider: record.provider,
          data: record.data,
        },
      },
      { upsert: true },
    );
  }

  async deleteUserIntegration(userId: string, category: string, provider: string): Promise<void> {
    const integrations = await this.collection<IntegrationDocument>('user_integrations');
    await integrations.deleteOne({ userId, category, provider });
  }

  async listCampaigns(userId: string): Promise<CampaignRecord[]> {
    const campaigns = await this.collection<CampaignDocument>('campaigns');
    const docs = await campaigns.find({ userId }).sort({ createdAt: 1 }).toArray();
    return docs.map((doc) => ({
      ...(doc.payload ?? {}),
      id: doc._id,
      userId: doc.userId,
      createdAt: doc.createdAt,
    } as CampaignRecord));
  }

  async createCampaign(campaign: CampaignRecord): Promise<CampaignRecord> {
    const campaigns = await this.collection<CampaignDocument>('campaigns');
    await campaigns.updateOne(
      { _id: campaign.id },
      {
        $set: {
          _id: campaign.id,
          userId: campaign.userId,
          createdAt: campaign.createdAt,
          payload: campaign,
        },
      },
      { upsert: true },
    );
    const doc = await campaigns.findOne({ _id: campaign.id });
    if (!doc) {
      throw new Error('Failed to persist campaign');
    }
    return {
      ...(doc.payload ?? {}),
      id: doc._id,
      userId: doc.userId,
      createdAt: doc.createdAt,
    } as CampaignRecord;
  }

  async listClients(): Promise<ClientRecord[]> {
    const clients = await this.collection<ClientDocument>('clients');
    const docs = await clients.find({}).sort({ createdAt: 1 }).toArray();
    return docs.map((doc) => ({
      ...(doc.payload ?? {}),
      id: doc._id,
      createdAt: doc.createdAt,
    } as ClientRecord));
  }

  async createClient(client: ClientRecord): Promise<ClientRecord> {
    const clients = await this.collection<ClientDocument>('clients');
    const createdAt = client.createdAt ?? new Date().toISOString();
    const payload = { ...client, createdAt } as ClientRecord;
    await clients.updateOne(
      { _id: client.id },
      {
        $set: {
          _id: client.id,
          createdAt,
          payload,
        },
      },
      { upsert: true },
    );
    const stored = await clients.findOne({ _id: client.id });
    if (!stored) {
      throw new Error('Failed to persist client');
    }
    return {
      ...(stored.payload ?? {}),
      id: stored._id,
      createdAt: stored.createdAt,
    } as ClientRecord;
  }

  async getClient(clientId: string): Promise<ClientRecord | null> {
    const clients = await this.collection<ClientDocument>('clients');
    const doc = await clients.findOne({ _id: clientId });
    if (!doc) {
      return null;
    }
    return {
      ...(doc.payload ?? {}),
      id: doc._id,
      createdAt: doc.createdAt,
    } as ClientRecord;
  }

  async updateClient(clientId: string, updates: Partial<ClientRecord>): Promise<ClientRecord | null> {
    const clients = await this.collection<ClientDocument>('clients');
    const existing = await clients.findOne({ _id: clientId });
    if (!existing) {
      return null;
    }
    const merged = { ...(existing.payload ?? {}), ...updates, id: clientId } as ClientRecord;
    await clients.updateOne(
      { _id: clientId },
      {
        $set: {
          payload: merged,
        },
      },
    );
    return merged;
  }

  async deleteClient(clientId: string): Promise<void> {
    const clients = await this.collection<ClientDocument>('clients');
    await clients.deleteOne({ _id: clientId });
    await (await this.collection<ClientOAuthDocument>('client_oauth')).deleteMany({ clientId });
    await (await this.collection<ClientCampaignDocument>('client_campaigns')).deleteMany({ clientId });
    await (await this.collection<BillingDocument>('client_billing')).deleteMany({ clientId });
    await (await this.collection<AdminClientDocument>('admin_clients')).deleteMany({ clientId });
  }

  async addAdminClient(adminId: string, clientId: string): Promise<void> {
    const adminClients = await this.collection<AdminClientDocument>('admin_clients');
    await adminClients.updateOne(
      { adminId, clientId },
      { $set: { adminId, clientId } },
      { upsert: true },
    );
  }

  async removeAdminClient(adminId: string, clientId: string): Promise<void> {
    const adminClients = await this.collection<AdminClientDocument>('admin_clients');
    await adminClients.deleteOne({ adminId, clientId });
  }

  async saveClientOAuth(clientId: string, platform: string, data: ClientOAuthRecord): Promise<void> {
    const oauth = await this.collection<ClientOAuthDocument>('client_oauth');
    await oauth.updateOne(
      { clientId, platform },
      { $set: { clientId, platform, data } },
      { upsert: true },
    );
  }

  async deleteClientOAuth(clientId: string, platform: string): Promise<void> {
    const oauth = await this.collection<ClientOAuthDocument>('client_oauth');
    await oauth.deleteOne({ clientId, platform });
  }

  async listClientCampaigns(clientId: string): Promise<ClientCampaignRecord[]> {
    const campaigns = await this.collection<ClientCampaignDocument>('client_campaigns');
    const docs = await campaigns.find({ clientId }).toArray();
    return docs.map((doc) => ({
      ...(doc.payload ?? {}),
      id: doc._id,
      clientId: doc.clientId,
    } as ClientCampaignRecord));
  }

  async saveClientCampaigns(clientId: string, campaigns: ClientCampaignRecord[]): Promise<void> {
    const collection = await this.collection<ClientCampaignDocument>('client_campaigns');
    await collection.deleteMany({ clientId });
    if (!campaigns.length) {
      return;
    }
    await collection.insertMany(
      campaigns.map((campaign) => ({
        _id: campaign.id,
        clientId,
        payload: campaign,
      })),
    );
  }

  async appendBillingEntry(clientId: string, entry: BillingEntry): Promise<void> {
    const billing = await this.collection<BillingDocument>('client_billing');
    await billing.insertOne({ ...entry, clientId });
  }

  async listBillingEntries(clientId: string): Promise<BillingEntry[]> {
    const billing = await this.collection<BillingDocument>('client_billing');
    const docs = await billing.find({ clientId }).sort({ timestamp: 1 }).toArray();
    return docs.map((doc) => ({
      timestamp: doc.timestamp,
      tokensUsed: doc.tokensUsed,
      cost: doc.cost,
      adminId: doc.adminId,
    }));
  }
}
