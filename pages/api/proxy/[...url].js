// pages/api/proxy/[...url].js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url } = req.query;
    
    if (!url || url.length === 0) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    // URL'i decode et ve birleştir
    const targetUrl = Array.isArray(url) ? 
      url.map(segment => decodeURIComponent(segment)).join('/') : 
      decodeURIComponent(url);

    console.log('Proxying URL:', targetUrl);

    // Headers'ı hazırla
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
      'Accept-Encoding': 'identity',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Sec-Fetch-Mode': 'no-cors',
      'Referer': getReferer(targetUrl),
      'Origin': getOrigin(targetUrl)
    };

    // Özel header'lar için domain kontrolü
    const customHeaders = getCustomHeaders(targetUrl);
    Object.assign(headers, customHeaders);

    const options = {
      method: req.method,
      headers: headers,
      redirect: 'follow',
      signal: AbortSignal.timeout(15000) // 15 saniye timeout
    };

    // POST istekleri için body
    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(targetUrl, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length');

    // Content type'a göre response'u işle
    if (contentType.includes('application/vnd.apple.mpegurl') || 
        contentType.includes('application/x-mpegurl') ||
        targetUrl.includes('.m3u8')) {
      
      let m3u8Content = await response.text();
      
      // M3U8 içindeki relative URL'leri absolute yap
      m3u8Content = await processM3U8Content(m3u8Content, targetUrl);
      
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Content-Length', Buffer.byteLength(m3u8Content));
      
      return res.send(m3u8Content);
      
    } else if (contentType.includes('video/') || 
               contentType.includes('audio/') ||
               targetUrl.includes('.ts') ||
               targetUrl.includes('.m4s') ||
               targetUrl.includes('.mp4')) {
      
      // Video/audio segmentleri için
      const buffer = await response.arrayBuffer();
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 saat cache
      if (contentLength) res.setHeader('Content-Length', contentLength);
      
      return res.send(Buffer.from(buffer));
      
    } else if (contentType.includes('application/json')) {
      
      const data = await response.json();
      res.setHeader('Content-Type', 'application/json');
      return res.json(data);
      
    } else if (contentType.includes('text/')) {
      
      const text = await response.text();
      res.setHeader('Content-Type', contentType);
      return res.send(text);
      
    } else {
      
      // Diğer tüm content typelar için
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      return res.send(Buffer.from(buffer));
    }

  } catch (error) {
    console.error('Proxy Error:', error);
    
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout' });
    }
    
    return res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      url: req.query.url 
    });
  }
}

// Helper functions
function getReferer(url) {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/`;
  } catch {
    return 'https://www.google.com/';
  }
}

function getOrigin(url) {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}`;
  } catch {
    return 'https://www.google.com';
  }
}

function getCustomHeaders(url) {
  const headers = {};
  
  // Domain bazlı özel header'lar
  if (url.includes('youtube.com') || url.includes('googlevideo.com')) {
    headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
  }
  
  if (url.includes('netflix.com') || url.includes('nflxvideo.net')) {
    headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
    headers['Accept'] = 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5';
  }
  
  return headers;
}

async function processM3U8Content(content, baseUrl) {
  const lines = content.split('\n');
  const processedLines = [];
  
  for (const line of lines) {
    let processedLine = line.trim();
    
    // Boş satırları ve yorumları atla
    if (!processedLine || processedLine.startsWith('#')) {
      processedLines.push(processedLine);
      continue;
    }
    
    // URL satırlarını işle
    if (processedLine && !processedLine.startsWith('#') && !processedLine.startsWith('http')) {
      try {
        const base = new URL(baseUrl);
        
        if (processedLine.startsWith('//')) {
          // Protocol-relative URL
          processedLine = `${base.protocol}${processedLine}`;
        } else if (processedLine.startsWith('/')) {
          // Absolute path
          processedLine = `${base.origin}${processedLine}`;
        } else {
          // Relative path
          const pathSegments = base.pathname.split('/').slice(0, -1);
          processedLine = `${base.origin}${pathSegments.join('/')}/${processedLine}`;
        }
        
        // Proxy URL'ye çevir
        processedLine = `/api/proxy/${encodeURIComponent(processedLine)}`;
        
      } catch (error) {
        console.log('URL processing error:', error);
        // Hata durumunda orijinal satırı kullan
      }
    }
    
    processedLines.push(processedLine);
  }
  
  return processedLines.join('\n');
}
