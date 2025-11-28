export default function handler(req, res) {
  // Return only public keys safe for client initialization (anon + url)
  // Try multiple common env var names to be tolerant of different setups.
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC__SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  ).trim();

  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANONKEY ||
    process.env.NEXT_PUBLIC__SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();

  // Basic validation to help detect malformed or accidentally-pasted secret strings
  const isValidUrl = typeof url === 'string' && /^https?:\/\/.+/.test(url);
  const looksLikeJwt = typeof anonKey === 'string' && /^ey[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(anonKey);

  if (!isValidUrl || !looksLikeJwt) {
    console.error('supabase-config: invalid or missing public config', {
      urlPresent: !!url,
      anonKeyPresent: !!anonKey,
      urlValue: url ? (url.length > 64 ? url.slice(0, 64) + '...' : url) : null,
    });

    return res.status(500).json({
      error:
        'Supabase public configuration is missing or invalid on the server.\nPlease set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel (or hosting) environment variables. Do NOT expose service_role or other secret keys to the client.',
    });
  }

  return res.status(200).json({ url, anonKey });
}
