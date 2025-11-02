// pages/advanced-player.js
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function AdvancedPlayer() {
  const router = useRouter();
  const { url, title } = router.query;
  const videoRef = useRef(null);
  const [hls, setHls] = useState(null);
  const [status, setStatus] = useState('Loading...');
  const [quality, setQuality] = useState('auto');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!url) {
      setStatus('No URL provided');
      return;
    }

    const initPlayer = async () => {
      try {
        const Hls = (await import('hls.js')).default;
        
        if (Hls.isSupported()) {
          const video = videoRef.current;
          const newHls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            maxBufferSize: 60 * 1000 * 1000, // 60MB
          });

          const proxyUrl = `/api/proxy/${url}`;
          
          newHls.loadSource(proxyUrl);
          newHls.attachMedia(video);

          newHls.on(Hls.Events.MANIFEST_PARSED, () => {
            setStatus('Ready - Auto-playing...');
            video.volume = volume;
            video.play().then(() => {
              setIsPlaying(true);
            }).catch(e => {
              setStatus('Click play to start');
            });
          });

          newHls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
            console.log('Quality loaded:', data);
          });

          newHls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            if (data.fatal) {
              switch(data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setStatus('Network error - retrying...');
                  newHls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setStatus('Media error - recovering...');
                  newHls.recoverMediaError();
                  break;
                default:
                  setStatus('Fatal error - reloading...');
                  setTimeout(() => {
                    newHls.loadSource(proxyUrl);
                    newHls.startLoad();
                  }, 5000);
                  break;
              }
            }
          });

          setHls(newHls);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = `/api/proxy/${url}`;
          setStatus('Using native HLS support');
          video.play().then(() => setIsPlaying(true));
        } else {
          setStatus('HLS not supported');
        }
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    };

    initPlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url]);

  const handleQualityChange = (level) => {
    if (hls && level !== 'auto') {
      hls.currentLevel = level;
    } else if (hls) {
      hls.currentLevel = -1; // auto
    }
    setQuality(level);
  };

  return (
    <div style={{ 
      padding: '0',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#000',
      color: 'white',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => router.push('/universal')}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {title || 'Universal Player'}
          </div>
          <div style={{ fontSize: '12px', color: '#ccc' }}>
            {status}
          </div>
        </div>
        
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Video Player */}
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <div style={{ 
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <video
            ref={videoRef}
            controls
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '75vh',
              backgroundColor: '#000'
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        {/* Controls */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ marginRight: '10px' }}>Ses:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (videoRef.current) {
                  videoRef.current.volume = newVolume;
                }
              }}
              style={{ width: '100px' }}
            />
            <span style={{ marginLeft: '10px' }}>{Math.round(volume * 100)}%</span>
          </div>

          <div>
            <label style={{ marginRight: '10px' }}>Kalite:</label>
            <select 
              value={quality}
              onChange={(e) => handleQualityChange(e.target.value)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#333',
                color: 'white',
                border: '1px solid #555',
                borderRadius: '4px'
              }}
            >
              <option value="auto">Auto</option>
              <option value="0">Lowest</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
              <option value="4">Highest</option>
            </select>
          </div>
        </div>

        {/* Stream Info */}
        <div style={{ 
          padding: '15px',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          marginTop: '10px'
        }}>
          <h4>Stream Bilgisi:</h4>
          <div style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            <strong>URL:</strong> {url ? decodeURIComponent(url) : 'N/A'}
          </div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            <strong>Player:</strong> {hls ? 'HLS.js' : 'Native'}
          </div>
        </div>
      </div>
    </div>
  );
}
