export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send("URL parametresi gerekli. Örn: /api/stream?url=http://...");
    return;
  }

  try {
    // URL parse et
    const parsed = new URL(url);

    // Güvenlik: sadece apx-me.com domainine izin ver
    if (parsed.hostname !== "apx-me.com") {
      res.status(403).send("Bu domain'e izin verilmiyor.");
      return;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      res.status(response.status).send("Stream error");
      return;
    }

    res.setHeader("Content-Type", response.headers.get("content-type") || "video/mp4");

    // Stream verisini pipe et
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
      }
