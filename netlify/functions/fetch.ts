import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  const videoUrl = event.queryStringParameters?.url;

  if (!videoUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL is required" }),
    };
  }

  try {
    // Get VM API URL from environment variable (Must be set in Netlify dashboard)
    const VM_API_URL = process.env.VITE_VM_API_URL || "http://YOUR_VM_IP:5000";
    
    const response = await fetch(`${VM_API_URL}/api/info?url=${encodeURIComponent(videoUrl)}`);
    
    if (!response.ok) {
      throw new Error("VM API responded with error");
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Netlify Function Error:", error);
    
    // Fallback/Mock for testing
    return {
      statusCode: 200,
      body: JSON.stringify({
        title: "Preview Mode: " + videoUrl,
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        duration: 260,
        formats: [
          { resolution: "1080p", ext: "mp4", url: "#" },
          { resolution: "720p", ext: "mp4", url: "#" },
          { resolution: "Audio", ext: "mp3", url: "#" }
        ]
      }),
    };
  }
};
