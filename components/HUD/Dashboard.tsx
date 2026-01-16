'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Play, Pause, Music, Zap, Share2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SONGS = [
  { id: '1', title: 'Blue Money', url: '/tracks/blue_money.mp3' },
  { id: '2', title: 'The OS of Funk', url: '/tracks/os_funk.mp3' },
  { id: '3', title: 'Resonance Cascade', url: '/tracks/resonance.mp3' },
  // Add more from your list here...
];

export default function Dashboard() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    setTrack, 
    dnaSeed, 
    activeRealm,
    realmType,
    setRealm 
  } = useStore();

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
      
      {/* TOP BAR: SYSTEM STATUS */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="glass-panel p-4 rounded-lg flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-neon animate-pulse' : 'bg-red-500'}`} />
          <div>
            <h1 className="text-xs tracking-tighter text-neon uppercase font-bold">Neural_OS_v10.0</h1>
            <p className="text-[10px] opacity-50 uppercase leading-none">Status: Operational</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-lg text-right">
          <p className="text-[10px] opacity-50 uppercase">Active_Realm</p>
          <p className="text-xs text-neon font-mono">{activeRealm}</p>
        </div>
      </div>

      {/* CENTER: DNA DATA (Only shows when playing) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 text-glow">
              {currentTrack?.title}
            </h2>
            <div className="flex gap-4 text-[10px] font-mono text-neon">
              <span>DNA_SEED: {dnaSeed}</span>
              <span>TYPE: 0x0{realmType.toString(16)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM: CONTROLS & TRACKLIST */}
      <div className="flex justify-between items-end pointer-events-auto gap-6">
        
        {/* TRACKLIST */}
        <div className="glass-panel w-64 h-48 overflow-y-auto rounded-lg p-2">
          <div className="text-[10px] opacity-50 mb-2 px-2 flex justify-between">
            <span>TRACK_ARCHIVE</span>
            <Music size={10} />
          </div>
          {SONGS.map((song) => (
            <button
              key={song.id}
              onClick={() => setTrack(song)}
              className={`w-full text-left p-2 text-[10px] transition-colors hover:bg-neon/10 rounded flex justify-between items-center group
                ${currentTrack?.id === song.id ? 'text-neon bg-neon/5' : 'text-white/70'}`}
            >
              <span className="truncate">{song.title.toUpperCase()}</span>
              <Play size={8} className="opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>

        {/* MAIN CONTROLS */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setRealm((realmType + 1) % 12, currentTrack?.title || "VOID")}
            className="glass-panel p-4 rounded-full hover:bg-neon/20 transition-all text-neon"
            title="Morph Realm"
          >
            <Layers size={20} />
          </button>
          
          <button 
            onClick={() => togglePlay()}
            className="glass-panel p-8 rounded-full hover:bg-neon/20 transition-all text-neon"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
          </button>
        </div>

      </div>

      <div className="scanline" />
    </div>
  );
}
