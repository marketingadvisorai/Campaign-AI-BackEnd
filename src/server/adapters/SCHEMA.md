# Database schema reference

The new database adapters rely on a consistent set of entities across Postgres, MySQL (PlanetScale), and MongoDB. The statements below describe the expected structure for each engine. Columns that store the full entity payloads are JSON columns so additional attributes can be stored without further migrations.

## Postgres

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_setup (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_setup_complete BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ,
  setup_data JSONB
);

CREATE TABLE user_workspace (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  workspace JSONB NOT NULL
);

CREATE TABLE user_integrations (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  provider TEXT NOT NULL,
  data JSONB NOT NULL,
  PRIMARY KEY (user_id, category, provider)
);

CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL
);

CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL
);

CREATE TABLE admin_clients (
  admin_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  PRIMARY KEY (admin_id, client_id)
);

CREATE TABLE client_oauth (
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  data JSONB NOT NULL,
  PRIMARY KEY (client_id, platform)
);

CREATE TABLE client_campaigns (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  payload JSONB NOT NULL
);

CREATE TABLE client_billing (
  id BIGSERIAL PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL,
  tokens_used NUMERIC NOT NULL,
  cost NUMERIC NOT NULL,
  admin_id TEXT REFERENCES users(id) ON DELETE SET NULL
);
```

## PlanetScale / MySQL

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_setup (
  user_id VARCHAR(36) PRIMARY KEY,
  is_setup_complete TINYINT(1) NOT NULL,
  completed_at TIMESTAMP NULL,
  setup_data JSON,
  CONSTRAINT fk_user_setup_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_workspace (
  user_id VARCHAR(36) PRIMARY KEY,
  workspace JSON NOT NULL,
  CONSTRAINT fk_user_workspace_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_integrations (
  user_id VARCHAR(36) NOT NULL,
  category VARCHAR(128) NOT NULL,
  provider VARCHAR(128) NOT NULL,
  data JSON NOT NULL,
  PRIMARY KEY (user_id, category, provider)
);

CREATE TABLE campaigns (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payload JSON NOT NULL,
  CONSTRAINT fk_campaign_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE clients (
  id VARCHAR(64) PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payload JSON NOT NULL
);

CREATE TABLE admin_clients (
  admin_id VARCHAR(36) NOT NULL,
  client_id VARCHAR(64) NOT NULL,
  PRIMARY KEY (admin_id, client_id)
);

CREATE TABLE client_oauth (
  client_id VARCHAR(64) NOT NULL,
  platform VARCHAR(64) NOT NULL,
  data JSON NOT NULL,
  PRIMARY KEY (client_id, platform)
);

CREATE TABLE client_campaigns (
  id VARCHAR(64) PRIMARY KEY,
  client_id VARCHAR(64) NOT NULL,
  payload JSON NOT NULL
);

CREATE TABLE client_billing (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  client_id VARCHAR(64) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  tokens_used DECIMAL(18, 4) NOT NULL,
  cost DECIMAL(18, 4) NOT NULL,
  admin_id VARCHAR(36) NOT NULL
);

CREATE INDEX idx_client_billing_client ON client_billing (client_id, timestamp);
```

## MongoDB

Create the following collections (no strict schema enforcement is required, but the fields are listed for clarity):

- `users`: `{ _id: string, email: string, name?: string, passwordHash: string, createdAt: string }`
- `user_setup`: `{ userId: string, isSetupComplete: boolean, completedAt?: string, setupData?: object }`
- `user_workspace`: `{ userId: string, workspace: object }`
- `user_integrations`: `{ userId: string, category: string, provider: string, data: object }`
- `campaigns`: `{ _id: string, userId: string, createdAt: string, payload: object }`
- `clients`: `{ _id: string, createdAt: string, payload: object }`
- `admin_clients`: `{ adminId: string, clientId: string }`
- `client_oauth`: `{ clientId: string, platform: string, data: object }`
- `client_campaigns`: `{ _id: string, clientId: string, payload: object }`
- `client_billing`: `{ clientId: string, timestamp: string, tokensUsed: number, cost: number, adminId: string }`

Create indexes to support lookups used by the adapters:

```javascript
// Example using the Mongo shell or driver

db.users.createIndex({ email: 1 }, { unique: true });
db.user_integrations.createIndex({ userId: 1, category: 1, provider: 1 }, { unique: true });
db.campaigns.createIndex({ userId: 1, createdAt: 1 });
db.client_campaigns.createIndex({ clientId: 1 });
db.client_billing.createIndex({ clientId: 1, timestamp: 1 });
```
