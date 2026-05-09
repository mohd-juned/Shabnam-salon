export async function generateGroomingPreview(
  base64Image: string,
  options: {
    baseStyle: string;
    beardStyle: string;
    texture: string;
    volume: string;
    fade: string;
  }
) {
  try {
    const response = await fetch("/api/groom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image, options }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.result;
    }
    
    // If we get a 404 (Static host like Netlify)
    if (response.status === 404) {
      throw new Error("Backend API Not Found: This feature requires a Server (Node.js). If you are using Netlify/Static hosting, the AI Grooming will not work. Please use the 'Shared Link' from AI Studio or host on Vercel/Railway.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Generation failed. Please check your AI API keys in Settings.");
    }
  } catch (error: any) {
    console.error("Fetch error:", error);
    throw error;
  }
}
