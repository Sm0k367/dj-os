'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Zap } from 'lucide-react';

export default function IgnitionPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const { togglePlay } = useStore();

  // 1. Simulate Neural OS Boot Sequence
  useEffect(() => {
    if (progress < 100) {
      const timeout = setTimeout(() => {
        setProgress(prev => Math.min(prev + Math.random() * 15, 100));
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setBootComplete(true), 500);
    }
  }, [progress]);

  const handleIgnite = () => {
    setLoading(false);
    // Unlocks AudioContext via the store
    togglePlay(false); 
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-matrix-black flex items-center justify-center p-6"
        >
          <div className="w-full max-w-md">
            {/* BOOT LOGO */}
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-8 text-center"
            >
              <h2 className="text-neon text-xl font-black tracking-[0.2em] uppercase">
                Neural_Vault_OS
              </h2>
              <p className="text-[10px] text-white/40 tracking-[0.5em] mt-2">
                ESTABLISHING_NEURAL_LINK
              </p>
            </motion.div>

            {/* PROGRESS BAR */}
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-neon shadow-[0_0_15px_#00f2ff]"
              />
            </div>

            <div className="flex justify-between font-mono text-[9px] text-white/30 uppercase mb-12">
              <span>Sector: {progress.toFixed(0)}%</span>
              <span>Buffer: Active</span>
            </div>

            {/* IGNITE BUTTON */}
            <div className="h-20 flex items-center justify-center">
              {bootComplete && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleIgnite}
                  className="group relative flex items-center gap-3 bg-neon text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:shadow-[0_0_30px_#00f2ff]"
                >
                  <Zap size={16} fill="black" />
                  <span>Ignite Engine</span>
                  <div className="absolute inset-0 rounded-full bg-neon animate-ping opacity-20 pointer-events-none" />
                </motion.button>
              )}
            </div>
          </div>

          {/* BACKGROUND DECOR */}
          <div className="absolute bottom-10 left-10 text-[8px] text-white/20 font-mono leading-relaxed uppercase">
            // INIT_KERNEL_v10.0.4<br />
            // LOADING_REALM_GEOMETRY... OK<br />
            // SYNCING_AUDIO_ANALYSER... OK<br />
            // DEPLOYING_VISUAL_MATRIX... OK
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
