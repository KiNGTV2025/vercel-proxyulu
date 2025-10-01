import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [playUrl, setPlayUrl] = useState("");

  const handlePlay = () => {
    if (url) {
      setPlayUrl(`/api/stream?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>IPTV Proxy Player</h1>
      <input
        type="text"
        placeholder="http://apx-me.com:8880/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "70%", padding: "0.5rem", borderRadius: "5px", marginRight: "0.5rem" }}
      />
      <button
        onClick={handlePlay}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "5px",
          background: "#0070f3",
          color: "white",
          cursor: "pointer"
        }}
      >
        Oynat
      </button>

      {playUrl && (
        <div style={{ marginTop: "2rem" }}>
          <video
            controls
            autoPlay
            style={{ width: "80%", maxWidth: "800px", borderRadius: "10px" }}
          >
            <source src={playUrl} type="application/x-mpegURL" />
            Tarayıcın video oynatmayı desteklemiyor.
          </video>
        </div>
      )}
    </div>
  );
}
