import { useRouter } from 'react';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ 
      padding: '50px 20px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>🚀 Umit Proxy Net</h1>
      <p style={{ color: '#666', marginBottom: '40px', fontSize: '18px' }}>
        VPN gerektiren yayınları VPNSiz izleyin!
      </p>

      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <button 
          onClick={() => router.push('/universal')}
          style={{
            padding: '15px 30px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '200px'
          }}
        >
          🌐 Universal VPN Bypass
        </button>
        
        <button 
          onClick={() => router.push('/advanced-player')}
          style={{
            padding: '15px 30px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '200px'
          }}
        >
          🎬 Gelişmiş Player
        </button>

        <button 
          onClick={() => router.push('/vlc-player')}
          style={{
            padding: '15px 30px',
            backgroundColor: '#ff8800',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '200px'
          }}
        >
          📱 VLC & Wuffy
        </button>
      </div>

      <div style={{ 
        marginTop: '50px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        maxWidth: '800px',
        margin: '50px auto 0',
        textAlign: 'left'
      }}>
        <h3>📖 Hızlı Başlangıç:</h3>
        <ol style={{ color: '#666', lineHeight: '1.6' }}>
          <li><strong>Universal VPN Bypass</strong> - Her türlü stream URL'sini test edin</li>
          <li><strong>Gelişmiş Player</strong> - Web'de direkt izleyin</li>
          <li><strong>VLC & Wuffy</strong> - Harici player'larda kullanın</li>
        </ol>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '5px' }}>
          <strong>Örnek URL:</strong>
          <code style={{ display: 'block', marginTop: '5px', padding: '10px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
            https://corestream.ronaldovurdu.help/hls/bein-sports-1.m3u8
          </code>
        </div>
      </div>
    </div>
  );
          }
