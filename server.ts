import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve __dirname safely for both ESM and CJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '50mb' }));

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    time: new Date().toISOString(), 
    env: process.env.NODE_ENV,
    node: process.version
  });
});

app.get("/api/debug-keys", (req, res) => {
  res.json({
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    NODE_ENV: process.env.NODE_ENV
  });
});

// --- AI SERVICE HELPERS ---

async function getIdentityDescription(base64Data: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return "";
  try {
    const genAI = new GoogleGenAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Analyze this face and describe it in 30 words for a photo prompt. Mention gender, skin tone, facial structure, eye shape. DO NOT mention hair or expression. Focus on permanent identity markers.",
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
    ]);
    return result.response.text();
  } catch (e) { 
    console.error("Gemini identity extraction failed:", e);
    return ""; 
  }
}

// --- API ROUTES ---

app.post("/api/groom", async (req, res) => {
  const { image, options } = req.body;
  if (!image) return res.status(400).json({ error: "Image required" });

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return res.status(400).json({ 
      error: "GEMINI_API_KEY Missing", 
      suggestion: "Please add GEMINI_API_KEY to your Render Environment settings." 
    });
  }

  try {
    const base64Data = image.split(",")[1] || image;
    const identityDescription = await getIdentityDescription(base64Data);
    
    // We create a clean prompt for a free high-quality generator
    const combinedPrompt = `Professional 4k studio portrait photo of a man, ${identityDescription}, with ${options.baseStyle} hairstyle, ${options.beardStyle} beard, ${options.texture} hair texture, ${options.volume} hair volume, ${options.fade} fade. High-end grooming, sharp details, medium lighting, cinematic view.`;

    // Using Pollinations AI for free, keyless image generation
    const encodedPrompt = encodeURIComponent(combinedPrompt);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1280&nologo=true&seed=${seed}`;

    // Test if the image is ready (optional but good for UX)
    res.json({ result: imageUrl });

  } catch (globalError: any) {
    console.error("Critical API error:", globalError);
    res.status(500).json({ error: "Server Internal Error", message: globalError.message });
  }
});

// --- VITE MIDDLEWARE ---

async function start() {
  console.log("Starting server initialization...");
  
  // Log available keys (safe check)
  const keys = {
    GEMINI: !!process.env.GEMINI_API_KEY,
  };
  console.log("Detected API Keys:", keys);

  if (process.env.NODE_ENV !== "production") {
    console.log("Development mode detected. Loading Vite...");
    try {
      // Using a dynamic string to prevent bundlers from eagerly pulling in Vite
      const viteModuleName = "vite";
      const { createServer: createViteServer } = await import(viteModuleName);
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware loaded.");
    } catch (e) {
      console.error("Failed to load Vite middleware:", e);
    }
  } else {
    console.log("Production mode detected.");
    // In production, we serve from the dist folder or current dir
    // Since bundled server is IN dist/, __dirname IS dist/
    const distPath = path.resolve(__dirname);
    const rootPath = path.resolve(__dirname, "..");
    console.log(`__dirname is: ${__dirname}`);
    console.log(`Serving static files from: ${distPath}`);
    
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      // Don't intercept API calls
      if (req.path.startsWith("/api")) return res.status(404).json({ error: "Not found" });
      
      const indexPath = path.join(distPath, "index.html");
      const altIndexPath = path.join(rootPath, "dist", "index.html");

      res.sendFile(indexPath, (err) => {
        if (err) {
          console.log(`Failed to find index.html at ${indexPath}, trying fallback...`);
          res.sendFile(altIndexPath, (err2) => {
            if (err2) {
              console.error(`CRITICAL: index.html not found anywhere!`);
              console.error(`Checked: ${indexPath} AND ${altIndexPath}`);
              res.status(500).send("Application files missing. Please check your build logs on Render.");
            }
          });
        }
      });
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server is LIVE on port ${PORT}`);
    console.log(`Health check at http://localhost:${PORT}/api/health`);
  });
}

start();
