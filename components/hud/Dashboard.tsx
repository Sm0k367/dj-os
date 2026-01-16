'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Volume2, VolumeX, Cpu, Activity } from 'lucide-react';

export default function Dashboard() {
  const { volume, setVolume, isMuted, toggleMute } = useStore();

  return (
    <div className="fixed inset-0 pointer-events-none p-8 flex flex-col justify-between">
      {/* Top Bar: System Status */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/50 border border-cyan-500/30 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-mono text-[10px] tracking-widest">SYSTEM_ACTIVE</span>
          </div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-cyan-500 to-transparent" />
        </div>

        <div className="bg-black/50 border border-cyan-500/30 p-4 backdrop-blur-md text-right">
          <p className="text-cyan-400 font-mono text-[10px] uppercase">Neural_Link: Stable</p>
          <p className="text-white/40 font-mono text-[8px]">IAD-1_VIRTUAL_NODE</p>
        </div>
      </div>

      {/* Bottom Bar: Audio Controls */}
      <div className="flex justify-between items-end">
        <div className="bg-black/50 border border-cyan-500/30 p-6 backdrop-blur-md pointer-events-auto flex items-center gap-6">
          <button 
            onClick={toggleMute}
            className="text-cyan-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className="flex flex-col gap-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-32 accent-cyan-500 bg-cyan-900/30 h-1 appearance-none cursor-pointer"
            />
            <span className="text-[8px] font-mono text-cyan-500/50 tracking-[0.2em]">OUTPUT_GAIN</span>
          </div>
        </div>

        <div className="flex gap-2 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 h-8 bg-cyan-500/20"
              style={{ 
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`,
                opacity: (i + 1) * 0.2 
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
