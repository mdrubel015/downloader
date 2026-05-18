import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to Fetch Video Info (Proxy to the Python Flask API on user's VM)
  app.get("/api/fetch", async (req, res) => {
    const videoUrl = req.query.url as string;
    
    if (!videoUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      // Get VM API URL from environment variable
      const VM_API_URL = process.env.VITE_VM_API_URL || "http://YOUR_VM_IP:5000";
      
      const response = await fetch(`${VM_API_URL}/api/info?url=${encodeURIComponent(videoUrl)}`);
      
      if (!response.ok) {
        throw new Error("VM API responded with error");
      }

      const data = await response.json();
      return res.json(data);
    } catch (error) {
      console.error("Proxy Error:", error);
      // Fallback/Mock for UI preview if real connection fails
      res.json({
        title: "Preview Mode: " + videoUrl,
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        duration: 260,
        formats: [
          { resolution: "1080p", ext: "mp4", url: "#" },
          { resolution: "720p", ext: "mp4", url: "#" },
          { resolution: "Audio", ext: "mp3", url: "#" }
        ]
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
