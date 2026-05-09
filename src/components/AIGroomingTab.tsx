import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Sparkles, Wand2, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateGroomingPreview } from '../geminiService';

const STYLES = [
  "Classic Pompadour", 
  "Modern Undercut", 
  "Textured Buzz Cut", 
  "French Crop", 
  "Mullet Taper", 
  "Wolf Cut", 
  "Burst Fade",
  "Textured Fringe",
  "Modern Shag",
  "Man Bun Undercut"
];
const BEARDS = [
  "Clean Shaven",
  "Heavy Stubble",
  "Corporate Beard",
  "Full Viking",
  "Designer Goatee",
  "Italian Beard",
  "Van Dyke",
  "Ducktail Beard"
];
const TEXTURES = ["Natural", "Sleek", "Textured", "Messy"];
const VOLUMES = ["Low", "Natural", "High"];
const FADES = ["No Fade", "Low Taper", "Mid Fade", "High Fade", "Skin Fade"];

export default function AIGroomingTab() {
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState({
    baseStyle: STYLES[1],
    beardStyle: BEARDS[5], // Defaulting to Italian Beard
    texture: TEXTURES[0],
    volume: VOLUMES[1],
    fade: FADES[2]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image is too large. Max 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateGroomingPreview(image, options);
      setPreview(result);
    } catch (err: any) {
      console.error("Grooming Error:", err);
      let errorMessage = "Our AI services are currently overcapacity. Please try again in 1 minute.";
      
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error === "AI Services Failed" || parsed.details) {
          const detailStrings = Object.entries(parsed.details || {})
            .map(([service, msg]) => `• ${service}: ${msg}`)
            .join("\n");
          errorMessage = `AI Services Failed:\n${detailStrings}\n\nPlease check your keys in the Settings (Gear icon).`;
        } else if (parsed.error) {
          errorMessage = parsed.error;
        }
      } catch (e) {
        if (err.message === "API_KEY_REQUIRED") {
          errorMessage = "AI Setup Needed: Please provide an API key (Replicate, Together, or AIML) in the Settings Gear icon to preserve your face.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
          <Sparkles size={14} />
          Powered by Gemini AI
        </div>
        <h2 className="text-5xl font-bold tracking-tight">Virtual Grooming</h2>
        <p className="text-stone-400 max-w-sm mx-auto">Precision sculpting with AI. Fine-tune your next look with our royal parameters.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Left: Preview/Upload */}
        <div className="space-y-6">
          <div className="relative aspect-square md:aspect-[4/5] bg-surface rounded-3xl border-2 border-dashed border-white/10 overflow-hidden group shadow-2xl">
            {image || preview ? (
              <>
                <img 
                  src={preview || image!} 
                  alt="Grooming Preview" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {!preview && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleReset} className="bg-red-600/80 p-4 rounded-full hover:bg-red-600 transition-all hover:rotate-90">
                      <RefreshCw size={24} />
                    </button>
                  </div>
                )}
                {preview && (
                  <div className="absolute top-6 right-6 flex flex-col gap-3">
                    <button onClick={() => window.open(preview, '_blank')} className="bg-primary p-4 rounded-full text-bg shadow-2xl hover:scale-110 transition-transform">
                      <Download size={24} />
                    </button>
                    <button onClick={handleReset} className="bg-white/10 backdrop-blur-xl p-4 rounded-full text-white hover:bg-white/20 transition-colors">
                      <RefreshCw size={24} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center space-y-4 hover:bg-white/5 transition-all"
              >
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner shadow-primary/20">
                  <Camera size={38} />
                </div>
                <div className="text-center px-6">
                  <p className="font-bold text-xl uppercase tracking-tighter">Upload Portrait</p>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mt-2 font-medium">PNG or JPG up to 10MB</p>
                </div>
              </button>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-bg/90 backdrop-blur-md flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full shadow-[0_0_30px_rgba(197,160,89,0.3)]"
                  />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={32} />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-serif italic text-2xl text-primary">Sculpting Preview...</p>
                  <p className="text-stone-500 text-sm tracking-wide">Our AI is refining your signature look.</p>
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-red-900/20 border border-red-500/30 p-5 rounded-2xl text-red-400 text-sm"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Controls */}
        <div className="space-y-6 glass p-6 rounded-[2.5rem] max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 sticky top-0 bg-surface/50 backdrop-blur-sm z-10 -mx-6 px-6 -mt-6 pt-6 mb-2">
              <h3 className="text-xl font-bold">Style Specs</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Touch Selection</span>
            </div>
            
            <ControlButtons 
              label="Hairstyle"
              options={STYLES}
              value={options.baseStyle}
              onChange={v => setOptions({ ...options, baseStyle: v })}
            />

            <ControlButtons 
              label="Beard Selection"
              options={BEARDS}
              value={options.beardStyle}
              onChange={v => setOptions({ ...options, beardStyle: v })}
            />
            
            <ControlButtons 
              label="Texture"
              options={TEXTURES}
              value={options.texture}
              onChange={v => setOptions({ ...options, texture: v })}
            />

            <ControlButtons 
              label="Volume"
              options={VOLUMES}
              value={options.volume}
              onChange={v => setOptions({ ...options, volume: v })}
            />

            <ControlButtons 
              label="Fade Tension"
              options={FADES}
              value={options.fade}
              onChange={v => setOptions({ ...options, fade: v })}
            />
          </div>

          <div className="sticky bottom-0 -mx-6 px-6 pt-4 pb-2 bg-gradient-to-t from-surface to-transparent mt-4">
            <button
              disabled={!image || isLoading}
              onClick={handleGenerate}
              className={`w-full py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden group
                ${image && !isLoading 
                  ? 'bg-primary text-bg hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20' 
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-50'}`}
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-tighter">
                <Wand2 size={22} />
                Generate Look
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButtons({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 ml-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              value === opt 
                ? 'bg-primary text-bg border-primary shadow-[0_0_15px_rgba(197,160,89,0.3)] scale-105' 
                : 'bg-bg/40 border-white/5 text-stone-400 hover:border-white/20 active:scale-95'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
