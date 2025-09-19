const requireEnv = (value: string | undefined, name: string) => {
  const normalized = (value ?? '').trim();
  if (!normalized) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return normalized;
};

const removeTrailingSlash = (url: string) => url.replace(/\/+$/, '');

export const supabaseUrl = removeTrailingSlash(
  requireEnv(import.meta.env.VITE_SUPABASE_URL, 'VITE_SUPABASE_URL')
);

export const supabaseAnonKey = requireEnv(
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  'VITE_SUPABASE_ANON_KEY'
);

export const supabaseFunctionsUrl = `${supabaseUrl}/functions/v1`;

export const getSupabaseFunctionUrl = (path: string) =>
  `${supabaseFunctionsUrl}/${path.replace(/^\/+/, '')}`;

