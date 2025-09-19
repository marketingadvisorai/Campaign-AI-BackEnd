
  # LLM Tune - Admin Dashboard (Arman)

  This is a code bundle for LLM Tune - Admin Dashboard (Arman). The original project is available at https://www.figma.com/design/amNzcxDsfxdCHbAWyhidMm/LLM-Tune---Admin-Dashboard--Arman-.

## Environment configuration

Copy `.env.example` to `.env` and update the values for your environment:

```
cp .env.example .env
```

- `VITE_API_BASE_URL` – Base URL for the Supabase Edge Functions that power authentication and dashboard APIs.
- `VITE_OAUTH_GOOGLE_CLIENT_ID` – Google OAuth client ID for initiating the replacement auth flow.
- `GOOGLE_OAUTH_CLIENT_ID` – Server-side Google OAuth client ID used by the Supabase Edge Function handlers (`src/supabase/functions/make-server/index.ts`, `src/supabase/functions/server/index.tsx`) when constructing the authorization URL.
- `GOOGLE_OAUTH_REDIRECT_URI` – Allowed redirect/callback URL that Google should send OAuth responses to. This should match the redirect registered in Google Cloud, the Supabase functions above, and the client-side handler that exchanges the code for tokens.

These variables are consumed by the Supabase Edge Functions that orchestrate OAuth (`src/supabase/functions/make-server/index.ts`, `src/supabase/functions/server/index.tsx`) and by the shared authentication service at `src/server/auth/service.ts`, which issues tokens and performs database operations for those handlers.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

The backend logic now runs inside Supabase Edge Functions rather than a standalone Deno service. Use the Supabase CLI to serve or deploy the functions housed under `src/supabase/functions/`, for example:

```
supabase functions serve make-server
supabase functions serve server
```

Refer to the Supabase documentation for details on configuring your project and deploying these handlers.
  
