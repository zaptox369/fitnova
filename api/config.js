const allowedMethods = new Set(['GET', 'HEAD']);

function normalizeSupabaseUrl(value) {
  const parsedUrl = new URL(value);
  if (
    parsedUrl.protocol !== 'https:' ||
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.port ||
    parsedUrl.pathname !== '/' ||
    parsedUrl.search ||
    parsedUrl.hash
  ) {
    throw new Error('Invalid Supabase URL');
  }

  return parsedUrl.origin;
}

function isPublicSupabaseKey(value) {
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(value)) return true;
  if (!value || value.startsWith('sb_secret_')) return false;

  // Older Supabase projects use JWT-shaped anon keys. Decode only the role
  // claim so a service_role JWT can never be returned from this public route.
  const parts = value.split('.');
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return payload.role === 'anon';
  } catch {
    return false;
  }
}

module.exports = function configHandler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!allowedMethods.has(request.method)) {
    response.setHeader('Allow', [...allowedMethods].join(', '));
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const supabaseUrl = process.env.FITNOVA_SUPABASE_URL;
  const supabaseAnonKey = process.env.FITNOVA_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return response.status(503).json({ error: 'Supabase is not configured.' });
  }

  let normalizedUrl;
  try {
    normalizedUrl = normalizeSupabaseUrl(supabaseUrl);
  } catch {
    return response.status(503).json({ error: 'Supabase configuration is invalid.' });
  }

  if (!isPublicSupabaseKey(supabaseAnonKey)) {
    return response.status(503).json({ error: 'Supabase publishable key configuration is invalid.' });
  }

  if (request.method === 'HEAD') return response.status(200).end();
  return response.status(200).json({ supabaseUrl: normalizedUrl, supabaseAnonKey });
};
