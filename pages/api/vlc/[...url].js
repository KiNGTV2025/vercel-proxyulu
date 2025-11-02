// pages/api/vlc/[...url].js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url } = req.query;
    
    if (!url || url.length === 0) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    const targetUrl = Array.isArray(url) ? 
      url.map(segment => decodeURIComponent(segment)).join('/') : 
      decodeURIComponent(url);

    console.log('VLC Proxy:', targetUrl);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'VLC/3.0.16 LibVLC/3.0.16',
        'Accept': '*/*',
        'Referer': 'https://www.google.com/'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.text();
    
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache');
    
    return res.send(data);

  } catch (error) {
    console.error('VLC Proxy Error:', error);
    return res.status(500).json({ 
      error: 'VLC Proxy error', 
      message: error.message 
    });
  }
}
