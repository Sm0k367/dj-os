'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Download, Share2, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PosterGenerator() {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const { currentTrack, dnaSeed, activeRealm, realmType } = useStore();

  const generatePoster = async () => {
    // 1. Grab the WebGL Canvas
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // 2. Create an Offscreen Canvas for high-res compositing (1080x1920)
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 1080;
    offCanvas.height = 1920;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return;

    // 3. Render Background & 3D Snapshot
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 1080, 1920);

    // Draw the 3D scene (aspect-ratio corrected)
    const scale = 1.5;
    const sw = canvas.width;
    const sh = canvas.height;
    ctx.drawImage(canvas, 1080/2 - (sw*scale)/2, 1920/2 - (sh*scale)/2, sw*scale, sh*scale);

    // 4. Overlay Futuristic Branding
    // Dark Gradient Bottom
    const grad = ctx.createLinearGradient(0, 1400, 0, 1920);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 1400, 1080, 520);

    // Text: Track Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Share Tech Mono';
    ctx.textAlign = 'center';
    ctx.fillText(currentTrack?.title.toUpperCase() || 'UNKNOWN_SIGNAL', 1080/2, 1650);

    // Text: DNA Metadata
    ctx.fillStyle = '#00f2ff';
    ctx.font = '40px Share Tech Mono';
    ctx.fillText(`DNA_SEED: ${dnaSeed}`, 1080/2, 1730);
    ctx.fillText(`REALM: ${activeRealm}`, 1080/2, 1790);

    // Footer Branding
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '30px Share Tech Mono';
    ctx.fillText('NEURAL_VAULT_OS // MULTIVERSE_ENGINE_v10', 1080/2, 1880);

    // 5. Output
    const dataURL = offCanvas.toDataURL('image/png');
    setPosterUrl(dataURL);
  };

  return (
    <>
      <button 
        onClick={generatePoster}
        className="glass-panel p-4 rounded-full text-neon hover:bg-neon/20 transition-all pointer-events-auto"
        title="Capture DNA Card"
      >
        <Camera size={20} />
      </button>

      <AnimatePresence>
        {posterUrl && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-sm w-full glass-panel p-2 rounded-xl overflow-hidden">
              <img src={posterUrl} alt="DNA Poster" className="w-full h-auto rounded-lg" />
              
              <div className="flex gap-2 p-4">
                <a 
                  href={posterUrl} 
                  download={`DNA_${dnaSeed}.png`}
                  className="flex-1 bg-neon text-black py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-xs"
                >
                  <Download size={16} /> DOWNLOAD
                </a>
                <button 
                  onClick={() => setPosterUrl(null)}
                  className="bg-white/10 p-3 rounded-lg text-white hover:bg-white/20"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
