'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Sliders, Activity, Zap, Save, RefreshCcw } from 'lucide-react';

export default function RealmEditor() {
  const { 
    realmType, 
    setRealm, 
    activeRealm, 
    dnaSeed,
    particleCount
  } = useStore();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This allows manual cycling through the 12+ Realm Types
    const newType = parseInt(e.target.value);
    setRealm(newType, activeRealm);
  };

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto"
    >
      <div className="glass-panel w-64 rounded-2xl p-6 flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Sliders size={18} className="text-neon" />
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase">Architect_Tools</h3>
        </div>

        {/* REALM SELECTOR */}
        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase">
            <span>Geometry_Index</span>
            <span className="text-neon">{realmType} / 11</span>
          </div>
          <input 
            type="range" min="0" max="11" step="1"
            value={realmType}
            onChange={handleSliderChange}
            className="w-full accent-neon bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
          />
        </div>

        {/* STATS READOUT */}
        <div className="space-y-2 bg-black/40 p-3 rounded-lg border border-white/5">
          <div className="flex justify-between text-[9px] font-mono uppercase">
            <span className="text-white/40">Density</span>
            <span>{particleCount.toLocaleString()} PTL</span>
          </div>
          <div className="flex justify-between text-[9px] font-mono uppercase">
            <span className="text-white/40">Sync_Seed</span>
            <span className="text-neon">{dnaSeed}</span>
          </div>
          <div className="flex justify-between text-[9px] font-mono uppercase">
            <span className="text-white/40">Computation</span>
            <span>Real_Time</span>
          </div>
        </div>

        {/* TOOL BUTTONS */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex flex-col items-center justify-center gap-2 p-3 glass-panel rounded-lg hover:bg-neon/10 transition-all group">
            <Save size={14} className="group-hover:text-neon" />
            <span className="text-[8px] uppercase">Save_DNA</span>
          </button>
          <button 
            onClick={() => setRealm((realmType + 1) % 12, activeRealm)}
            className="flex flex-col items-center justify-center gap-2 p-3 glass-panel rounded-lg hover:bg-neon/10 transition-all group"
          >
            <RefreshCcw size={14} className="group-hover:text-neon" />
            <span className="text-[8px] uppercase">Randomize</span>
          </button>
        </div>

        {/* HUD WARNING */}
        <div className="flex items-start gap-2 text-[8px] text-white/20 uppercase italic">
          <Activity size={10} className="shrink-0" />
          <span>Manual override may cause temporal geometry instability</span>
        </div>
      </div>
    </motion.div>
  );
}
