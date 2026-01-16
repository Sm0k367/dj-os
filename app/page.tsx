'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// VERCEL BUILD FIX: 
// These components use 'window' or 'navigator' which don't exist on the server.
// 'ssr: false' tells Next.js to only load them once the site hits the browser.

const NeuralCanvas = dynamic(() => import('@/components/neural/NeuralCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] animate-pulse">
        CONNECTING_TO_CORE...
      </div>
    </div>
  )
});

const HUD = dynamic(() => import('@/components/hud/Dashboard'), { 
  ssr: false 
});

const AudioEngine = dynamic(() => import('@/components/audio/AudioEngine'), { 
  ssr: false 
});

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-black overflow-hidden">
      {/* 1. The 3D World (Lowest Z-Index) */}
      <NeuralCanvas />

      {/* 2. The Logic Layer (No Visuals) */}
      <AudioEngine />

      {/* 3. The User Interface (Highest Z-Index) */}
      <div className="relative z-10 pointer-events-none">
        <HUD />
      </div>

      {/* 4. Global Overlay FX */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100" />
    </main>
  );
}
