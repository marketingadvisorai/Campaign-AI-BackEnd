
  # LLM Tune - Admin Dashboard (Arman)

  This is a code bundle for LLM Tune - Admin Dashboard (Arman). The original project is available at https://www.figma.com/design/amNzcxDsfxdCHbAWyhidMm/LLM-Tune---Admin-Dashboard--Arman-.

## Environment configuration

Copy `.env.example` to `.env` and update the values for your environment:

```
cp .env.example .env
```

- `VITE_API_BASE_URL` – Base URL for the shared backend service that now handles authentication and dashboard APIs.
- `VITE_OAUTH_GOOGLE_CLIENT_ID` – Google OAuth client ID for initiating the replacement auth flow.
- `GOOGLE_OAUTH_CLIENT_ID` – Server-side Google OAuth client ID used by the standalone API service when constructing the authorization URL.
- `GOOGLE_OAUTH_REDIRECT_URI` – Allowed redirect/callback URL that Google should send OAuth responses to. This should match the redirect registered in Google Cloud and the client-side handler that exchanges the code for tokens exposed by the standalone API service.

When hosting the standalone API server, set the following runtime environment variables in the deployment environment (they are not consumed by Vite but by the server runtime):

- `JWT_SECRET` – Symmetric key the API uses to sign and verify session tokens.
- `JWT_TTL_SECONDS` – Optional override for token lifetime in seconds (defaults to `3600`).
- `DB_VENDOR` – Selects which database adapter to use (`postgres`, `mysql`, or `mongo`).
  - Postgres: provide `POSTGRES_URL` (and optionally `POSTGRES_PASSWORD`).
  - PlanetScale MySQL: provide `PLANETSCALE_HOST`, `PLANETSCALE_USERNAME`, `PLANETSCALE_PASSWORD`, and optionally `PLANETSCALE_DATABASE`.
  - MongoDB: provide `MONGODB_URI` (and optionally `MONGODB_DB`, defaulting to `campaign_ai`).

The `VITE_*` variables are consumed by `src/utils/api.ts`, which centralizes all calls to the new backend and automatically injects stored JWTs. The Google OAuth and runtime variables are read by the standalone API implementation in `src/server` and the Supabase shim in `src/supabase/functions`.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
  
