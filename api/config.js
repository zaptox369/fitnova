const allowedKeys = ['GET', 'HEAD'];

module.exports = function configHandler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!allowedKeys.includes(request.method)) {
    response.setHeader('Allow', allowedKeys.join(', '));
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const supabaseUrl = process.env.FITNOVA_SUPABASE_URL;
  const supabaseAnonKey = process.env.FITNOVA_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return response.status(503).json({ error: 'Supabase is not configured.' });
  }

  try {
    const parsedUrl = new URL(supabaseUrl);
    if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password || parsedUrl.search || parsedUrl.hash) {
      throw new Error('Invalid Supabase URL');
    }
  } catch {
    return response.status(503).json({ error: 'Supabase configuration is invalid.' });
  }

  return response.status(200).json({ supabaseUrl, supabaseAnonKey });
};
