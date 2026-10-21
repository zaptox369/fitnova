const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

const ALLOWED_ORIGINS = new Set([
  'https://fitnova-sepia.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
]);

function buildQuery(lat, lng) {
  const location = `${lat},${lng}`;
  return `[out:json][timeout:8];(nwr["leisure"="fitness_centre"](around:5000,${location});nwr["amenity"="gym"](around:5000,${location});nwr["sport"~"yoga|running|cycling"](around:5000,${location});nwr["leisure"~"sports_centre|swimming_pool|park"](around:5000,${location});nwr["highway"="cycleway"](around:5000,${location}););out center 30;`;
}

module.exports = async function placesHandler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const origin = request.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return response.status(403).json({ error: 'Request origin is not allowed.' });
  }

  const body = typeof request.body === 'string'
    ? (() => { try { return JSON.parse(request.body); } catch { return null; } })()
    : request.body;
  const lat = Number(body && body.lat);
  const lng = Number(body && body.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return response.status(400).json({ error: 'Valid latitude and longitude are required.' });
  }

  const query = buildQuery(lat.toFixed(5), lng.toFixed(5));
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const upstream = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'User-Agent': 'FitNova/1.0 (+https://fitnova-sepia.vercel.app)'
        },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(2600)
      });
      if (!upstream.ok) continue;

      const result = await upstream.json();
      if (!result || !Array.isArray(result.elements)) continue;
      return response.status(200).json({ elements: result.elements });
    } catch {
      // Try the next fixed Overpass mirror; never expose upstream details.
    }
  }

  return response.status(502).json({ error: 'Nearby location service is temporarily unavailable.' });
};
