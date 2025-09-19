
# LLM Tune - Admin Dashboard (Arman)

This is a code bundle for LLM Tune - Admin Dashboard (Arman). The original project is available at <https://www.figma.com/design/amNzcxDsfxdCHbAWyhidMm/LLM-Tune---Admin-Dashboard--Arman->.

## Environment variables

The dashboard reads its Supabase configuration from the following Vite environment variables:

- `VITE_SUPABASE_URL` – the Supabase project URL (e.g. `https://abc123.supabase.co`).
- `VITE_SUPABASE_ANON_KEY` – the Supabase anon public API key used by the web client.

Create a `.env.local` file before running the app locally:

```bash
cp .env.example .env.local
```

Then update the values with your Supabase project credentials. These same variables must be configured in Vercel under **Project Settings → Environment Variables** so the correct Supabase project is injected at build and runtime.

## Running the code

Run `npm i` to install the dependencies.

Start the development server with the environment variables loaded (Vite automatically loads `.env.local`):

```bash
npm run dev
```

To validate a production build locally, run:

```bash
npm run build
```
  
