
  # LLM Tune - Admin Dashboard (Arman)

  This is a code bundle for LLM Tune - Admin Dashboard (Arman). The original project is available at https://www.figma.com/design/amNzcxDsfxdCHbAWyhidMm/LLM-Tune---Admin-Dashboard--Arman-.

## Environment configuration

Copy `.env.example` to `.env` and update the values for your environment:

```
cp .env.example .env
```

- `VITE_API_BASE_URL` – Base URL for the standalone Campaign AI API service that exposes authentication and dashboard endpoints.
- `VITE_OAUTH_GOOGLE_CLIENT_ID` – Google OAuth client ID used in the browser to kick off the replacement auth flow.
- `GOOGLE_OAUTH_CLIENT_ID` – Server-side Google OAuth client ID read by the standalone API service (`src/server/api/app.ts`) when constructing the authorization URL.
- `GOOGLE_OAUTH_REDIRECT_URI` – Allowed redirect/callback URL that Google should send OAuth responses to. This should match the redirect registered in Google Cloud, the API service above, and the client-side handler that exchanges the code for tokens.

These variables are consumed by the Deno-based API service (`src/server/api/app.ts`) and by the shared authentication service at `src/server/auth/service.ts`, which issues tokens and performs database operations on behalf of the HTTP handlers.

The move to a standalone API introduces additional runtime configuration that must be set in the server environment:

- `DB_VENDOR` – Selects which database adapter to load (`postgres`, `mysql`, or `mongo`).
- Postgres adapter: `POSTGRES_URL` (required) and `POSTGRES_PASSWORD` (optional helper for passwordless URLs).
- PlanetScale/MySQL adapter: `PLANETSCALE_HOST`, `PLANETSCALE_USERNAME`, `PLANETSCALE_PASSWORD`, and `PLANETSCALE_DATABASE`.
- MongoDB adapter: `MONGODB_URI` and `MONGODB_DB` (defaults to `campaign_ai`).
- Authentication: `JWT_SECRET` (required signing secret) and `JWT_TTL_SECONDS` (token lifetime in seconds, defaults to `3600`).

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

The backend logic now runs inside Supabase Edge Functions rather than a standalone Deno service. Use the Supabase CLI to serve or deploy the functions housed under `src/supabase/functions/`, for example:

```
supabase functions serve make-server
supabase functions serve server
```

Refer to the Supabase documentation for details on configuring your project and deploying these handlers.
  
