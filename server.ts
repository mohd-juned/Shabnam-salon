import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// --- AI SERVICE HELPERS ---

function getReplicate() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;
  return new Replicate({ auth: token });
}

async function useAIMLAPI(prompt: string) {
  const key = process.env.AIMLAPI_KEY;
  if (!key) return { error: "Key not found in Environment Variables." };
  
  // Try Flux Schnell first for free tiers, then DALL-E 3
  const models = ["flux-schnell", "dall-e-3", "stable-diffusion-v1-5"];
  let lastError = "";

  for (const model of models) {
    try {
      console.log(`Trying AIML API with model: ${model}`);
      const response = await fetch("https://api.aimlapi.com/v1/images/generations", {
        headers: { 
          "Authorization": `Bearer ${key}`, 
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify({ model, prompt, n: 1, size: "1024x1024" }),
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (response.ok && data.data?.[0]?.url) {
        return { result: data.data[0].url };
      } else {
        lastError = data.error?.message || data.message || `Status ${response.status}: ${JSON.stringify(data)}`;
        console.error(`AIML ${model} error:`, lastError);
      }
    } catch (e) {
      lastError = String(e);
    }
  }
  return { error: lastError };
}

async function useOpenRouter(prompt: string) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return { error: "Key not found." };
  
  try {
    // OpenRouter typically doesn't offer a standard /images/generations endpoint.
    // They are primarily for LLMs. If using OpenRouter, we'd have to use a model 
    // like Gemini or DALL-E via chat completions, but it's unreliable for direct image URLs.
    return { error: "OpenRouter does not support the standard /images/generations endpoint. Please use Replicate or AIML API for image generation." };
  } catch (e) { return { error: String(e) }; }
}

async function useTogetherAI(prompt: string) {
  const key = process.env.TOGETHER_API_KEY;
  if (!key) return { error: "Together API key not found in Settings." };
  
  const models = ["black-forest-labs/FLUX.1-schnell", "stabilityai/stable-diffusion-xl-base-1.0"];
  let lastError = "";

  for (const model of models) {
    try {
      console.log(`Trying Together AI with model: ${model}`);
      const response = await fetch("https://api.together.xyz/v1/images/generations", {
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ model, prompt, width: 1024, height: 1024, steps: 4, n: 1 }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data?.[0]?.url) return { result: data.data[0].url };
      } else {
        const errText = await response.text();
        lastError = `Together ${model} failed (${response.status}): ${errText}`;
        console.error(lastError);
      }
    } catch (e) {
      lastError = String(e);
    }
  }
  return { error: lastError };
}

async function getIdentityDescription(base64Data: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return "";
  try {
    const genAI = new GoogleGenAI(key);
    // Use gemini-1.5-flash for reliability
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Describe this person's facial features in extreme detail for a high-quality image generation prompt. Focus on: skin tone, eye shape, nose shape, face structure. DO NOT mention hair. Use technical portrait photography terms.",
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

  const base64Data = image.split(",")[1] || image;
  const identity = await getIdentityDescription(base64Data);
  const prompt = `A professional 4k portrait of a man with ${options.baseStyle} hair, ${options.beardStyle}, ${options.texture} texture, ${options.volume} volume, and ${options.fade}. Face features: ${identity || "Maintain exact identity"}. Sharp focus, hyper-realistic, studio lighting.`;

  const errors: Record<string, string> = {};

  // 1. Replicate (High quality)
  if (process.env.REPLICATE_API_TOKEN) {
    const repl = getReplicate();
    if (repl) {
      try {
        const output = await repl.run(
          "stability-ai/sdxl:39ed52f0c782c380c1d1ba76195fb788c036d066b0432313364956d70aeb756f",
          { input: { prompt, image, width: 768, height: 1024, prompt_strength: 0.5 } }
        );
        if (Array.isArray(output) && output[0]) return res.json({ result: output[0] });
      } catch (e: any) { 
        errors.Replicate = e.message; 
        console.error("Replicate Error:", e);
      }
    }
  }

  // 2. OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    const or = await useOpenRouter(prompt);
    if (or.result) return res.json({ result: or.result });
    if (or.error) errors.OpenRouter = or.error;
  }

  // 3. Together AI
  if (process.env.TOGETHER_API_KEY) {
    const tog = await useTogetherAI(prompt);
    if (tog.result) return res.json({ result: tog.result });
    if (tog.error) errors.Together = tog.error;
  }

  // 4. AIML API
  if (process.env.AIMLAPI_KEY) {
    const aiml = await useAIMLAPI(prompt);
    if (aiml.result) return res.json({ result: aiml.result });
    if (aiml.error) errors.AIML = aiml.error;
  }

  res.status(500).json({ 
    error: "AI Services Failed", 
    details: errors,
    suggestion: "Check your API keys in Settings. Server-side backend is required."
  });
});

// --- VITE MIDDLEWARE ---

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => res.sendFile(path.join(process.cwd(), "dist", "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
