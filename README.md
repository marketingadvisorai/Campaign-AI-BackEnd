
  # LLM Tune - Admin Dashboard (Arman)

  This is a code bundle for LLM Tune - Admin Dashboard (Arman). The original project is available at https://www.figma.com/design/amNzcxDsfxdCHbAWyhidMm/LLM-Tune---Admin-Dashboard--Arman-.

## Environment configuration

Copy `.env.example` to `.env` and update the values for your environment:

```
cp .env.example .env
```

- `VITE_API_BASE_URL` – Base URL for the shared backend service that now handles authentication and dashboard APIs.
- `VITE_OAUTH_GOOGLE_CLIENT_ID` – Google OAuth client ID for initiating the replacement auth flow.
- `GOOGLE_OAUTH_CLIENT_ID` – Server-side Google OAuth client ID used by the Supabase functions when constructing the authorization URL.
- `GOOGLE_OAUTH_REDIRECT_URI` – Allowed redirect/callback URL that Google should send OAuth responses to. This should match the redirect registered in Google Cloud and the client-side handler that exchanges the code for tokens.

These variables are consumed by `src/utils/api.ts`, which centralizes all calls to the new backend and automatically injects stored JWTs.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
  
