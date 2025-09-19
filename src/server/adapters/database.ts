import { MongoAdapter } from './mongo.ts';
import { MySQLAdapter } from './mysql.ts';
import { PostgresAdapter } from './postgres.ts';

export interface UserRecord {
  id: string;
  email: string;
  name?: string | null;
  passwordHash: string;
  createdAt: string;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name?: string | null;
}

export interface UserSetupRecord {
  isSetupComplete: boolean;
  completedAt?: string | null;
  setupData?: Record<string, unknown> | null;
}

export interface WorkspaceRecord {
  id: string;
  name: string;
  createdAt: string;
}

export interface IntegrationRecord {
  userId: string;
  category: string;
  provider: string;
  data: Record<string, unknown>;
}

export type IntegrationMap = Record<string, Record<string, Record<string, unknown>>>;

export interface CampaignRecord extends Record<string, unknown> {
  id: string;
  userId: string;
  createdAt: string;
}

export interface ClientRecord extends Record<string, unknown> {
  id: string;
  createdAt: string;
}

export interface ClientOAuthRecord extends Record<string, unknown> {
  connectedAt: string;
  connectedBy: string;
}

export interface BillingEntry {
  timestamp: string;
  tokensUsed: number;
  cost: number;
  adminId: string;
}

export interface ClientCampaignRecord extends Record<string, unknown> {
  id: string;
  clientId: string;
}

export interface DatabaseAdapter {
  createUser(user: CreateUserInput): Promise<UserRecord>;
  getUserByEmail(email: string): Promise<UserRecord | null>;
  getUserById(userId: string): Promise<UserRecord | null>;

  getUserSetup(userId: string): Promise<UserSetupRecord | null>;
  saveUserSetup(userId: string, data: UserSetupRecord): Promise<void>;
  getUserWorkspace(userId: string): Promise<WorkspaceRecord | null>;
  saveUserWorkspace(userId: string, workspace: WorkspaceRecord): Promise<void>;

  listUserIntegrations(userId: string): Promise<IntegrationMap>;
  getUserIntegration(userId: string, category: string, provider: string): Promise<Record<string, unknown> | null>;
  upsertUserIntegration(record: IntegrationRecord): Promise<void>;
  deleteUserIntegration(userId: string, category: string, provider: string): Promise<void>;

  listCampaigns(userId: string): Promise<CampaignRecord[]>;
  createCampaign(campaign: CampaignRecord): Promise<CampaignRecord>;

  listClients(): Promise<ClientRecord[]>;
  createClient(client: ClientRecord): Promise<ClientRecord>;
  getClient(clientId: string): Promise<ClientRecord | null>;
  updateClient(clientId: string, updates: Partial<ClientRecord>): Promise<ClientRecord | null>;
  deleteClient(clientId: string): Promise<void>;
  addAdminClient(adminId: string, clientId: string): Promise<void>;
  removeAdminClient(adminId: string, clientId: string): Promise<void>;

  saveClientOAuth(clientId: string, platform: string, data: ClientOAuthRecord): Promise<void>;
  deleteClientOAuth(clientId: string, platform: string): Promise<void>;

  listClientCampaigns(clientId: string): Promise<ClientCampaignRecord[]>;
  saveClientCampaigns(clientId: string, campaigns: ClientCampaignRecord[]): Promise<void>;
  appendBillingEntry(clientId: string, entry: BillingEntry): Promise<void>;
  listBillingEntries(clientId: string): Promise<BillingEntry[]>;
}

let cachedAdapter: DatabaseAdapter | null = null;

export function getDatabaseAdapter(): DatabaseAdapter {
  if (cachedAdapter) {
    return cachedAdapter;
  }

  const vendor = (Deno.env.get('DB_VENDOR') ?? 'postgres').toLowerCase();

  switch (vendor) {
    case 'postgres':
      cachedAdapter = new PostgresAdapter();
      break;
    case 'mysql':
      cachedAdapter = new MySQLAdapter();
      break;
    case 'mongo':
    case 'mongodb':
      cachedAdapter = new MongoAdapter();
      break;
    default:
      throw new Error(`Unsupported DB_VENDOR value: ${vendor}`);
  }

  return cachedAdapter;
}
