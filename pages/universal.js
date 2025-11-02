// pages/universal.js
import { useState } from 'react';

export default function UniversalProxy() {
  const [url, setUrl] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const popularSites = [
    {
      name: 'Bein Sports',
      url: 'https://corestream.ronaldovurdu.help/hls/bein-sports-1.m3u8'
    },
    {
      name: 'YouTube (örnek)',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      name: 'Twitch (örnek)',
      url: 'https://www.twitch.tv/example'
    },
    {
      name: 'Dizi/Film Sitesi',
      url: 'https://example-stream-site.com/stream.m3u8'
    }
  ];

  const testProxy = async (testUrl = url) => {
    if (!testUrl) {
      setMessage('Lütfen bir URL girin');
      return;
    }

    setLoading(true);
    setMessage('Testing...');

    try {
      const encodedUrl = encodeURIComponent(testUrl);
      const response = await fetch(`/api/proxy/${encodedUrl}`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.text();
      
      setProxyUrl(`/api/proxy/${encodedUrl}`);
      setMessage(`✅ Proxy başarılı! (${data.length} bytes)`);
      
      // History'e ekle
      if (!history.some(item => item.url === testUrl)) {
        setHistory(prev => [...prev.slice(-9), { url: testUrl, timestamp: new Date() }]);
      }
      
    } catch (error) {
      setMessage(`❌ Hata: ${error.message}`);
      setProxyUrl('');
    } finally {
      setLoading(false);
    }
  };

  const openInPlayer = () => {
    if (proxyUrl) {
      const encoded = encodeURIComponent(url);
      window.open(`/player?url=${encoded}`, '_blank');
    }
  };

  const openDirectProxy = () => {
    if (proxyUrl) {
      window.open(proxyUrl, '_blank');
    }
  };

  const copyToClipboard = () => {
    if (proxyUrl) {
      const fullUrl = `${window.location.origin}${proxyUrl}`;
      navigator.clipboard.writeText(fullUrl);
      setMessage('📋 URL kopyalandı!');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>🌐 Universal VPN Bypass Proxy</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        VPN gerektiren yayınları VPNSiz izlemek için proxy aracı
      </p>

      {/* URL Input */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Stream URL:
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/stream.m3u8 veya herhangi bir video URL'si"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => testProxy()}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Testing...' : 'Test Proxy'}
          </button>
          
          <button 
            onClick={openInPlayer}
            disabled={!proxyUrl}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🎬 Player'da Aç
          </button>
        </div>
      </div>

      {/* Status */}
      {message && (
        <div style={{
          padding: '15px',
          backgroundColor: message.includes('✅') ? '#d1fae5' : 
                         message.includes('❌') ? '#fee2e2' : '#fef3c7',
          border: '1px solid',
          borderColor: message.includes('✅') ? '#10b981' : 
                      message.includes('❌') ? '#ef4444' : '#f59e0b',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      {/* Proxy URL */}
      {proxyUrl && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '10px' }}>Proxy URL:</h3>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <code style={{ 
              flex: 1,
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '5px',
              border: '1px solid #e9ecef',
              wordBreak: 'break-all',
              fontSize: '14px'
            }}>
              {window.location.origin}{proxyUrl}
            </code>
            
            <button 
              onClick={copyToClipboard}
              style={{
                padding: '10px 15px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              📋 Kopyala
            </button>
            
            <button 
              onClick={openDirectProxy}
              style={{
                padding: '10px 15px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🔗 Direkt Aç
            </button>
          </div>
        </div>
      )}

      {/* Popular Sites */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>🎯 Popüler Stream Örnekleri</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {popularSites.map((site, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              border: '1px solid #e5e5e5',
              borderRadius: '5px'
            }}>
              <div>
                <strong>{site.name}</strong>
                <div style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                  {site.url}
                </div>
              </div>
              <button 
                onClick={() => {
                  setUrl(site.url);
                  testProxy(site.url);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Test Et
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '15px' }}>📚 Geçmiş</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {history.slice().reverse().map((item, index) => (
              <div key={index} style={{
                padding: '10px',
                border: '1px solid #e5e5e5',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => {
                setUrl(item.url);
                testProxy(item.url);
              }}>
                <div style={{ wordBreak: 'break-all', fontSize: '14px' }}>
                  {item.url}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {item.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
