# LLM Tune - Admin Dashboard (Arman)

This is a code bundle for LLM Tune - Admin Dashboard (Arman). The original project is available at https://www.figma.com/design/amNzcxDsfxdCHbAWyhidMm/LLM-Tune---Admin-Dashboard--Arman-.

## Environment configuration

Copy `.env.example` to `.env` and update the values for your environment:

```
cp .env.example .env
```

- `VITE_API_BASE_URL` – Base URL for the Campaign AI API served by the Hono application in `src/server/api/app.ts`. When running locally, point this to the address exposed by the Deno server (for example `http://localhost:8000`).
- `VITE_OAUTH_GOOGLE_CLIENT_ID` – Google OAuth client ID for initiating the client-side auth flow.
- `GOOGLE_OAUTH_CLIENT_ID` – Server-side Google OAuth client ID consumed by the Hono handlers when constructing the authorization URL.
- `GOOGLE_OAUTH_REDIRECT_URI` – Allowed redirect/callback URL that Google should send OAuth responses to. This should match the redirect registered in Google Cloud, the API server, and the client-side handler that exchanges the code for tokens.

These variables are consumed by the API handlers under `src/server/api/app.ts` and by the shared authentication service at `src/server/auth/service.ts`, which issues tokens and performs database operations for those handlers.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

Run `npm run api:serve` (or `deno run -A src/server/api/serve.ts`) to start the Hono API server. Ensure `deno` is installed locally and export the environment variables above so the server can issue tokens and talk to your database adapter of choice.

Refer to the Deno and deployment platform documentation for details on configuring your project and deploying the API server.
