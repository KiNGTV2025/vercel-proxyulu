// pages/vlc-player.js
import { useState } from 'react';

export default function VLCPlayer() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const generateVLCLink = () => {
    if (!url) {
      setMessage('Lütfen URL girin');
      return;
    }

    const encodedUrl = encodeURIComponent(url);
    const vlcUrl = `${window.location.origin}/api/vlc/${encodedUrl}`;
    
    setMessage(`VLC URL: ${vlcUrl}`);
    
    // Panoya kopyala
    navigator.clipboard.writeText(vlcUrl);
    setTimeout(() => {
      setMessage('✅ VLC URLsi panoya kopyalandı! VLCde Media → Open Network Stream yapıştırın');
    }, 100);
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <h1>📱 VLC Player Proxy</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="M3U8 URL girin..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px',
            marginBottom: '10px'
          }}
        />
        <button 
          onClick={generateVLCLink}
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
          VLC Linki Oluştur
        </button>
      </div>

      {message && (
        <div style={{
          padding: '15px',
          backgroundColor: message.includes('✅') ? '#d1fae5' : '#fef3c7',
          border: '1px solid',
          borderColor: message.includes('✅') ? '#10b981' : '#f59e0b',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <h3>Kullanım Kılavuzu:</h3>
        <ol>
          <li>M3U8 URL'sini yukarıya yapıştır</li>
          <li>"VLC Linki Oluştur" butonuna tıkla</li>
          <li>Oluşan linki VLC Player'da aç:
            <ul>
              <li>VLC'yi aç</li>
              <li>Media → Open Network Stream</li>
              <li>Linki yapıştır</li>
              <li>Play butonuna tıkla</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}
