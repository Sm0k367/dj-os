'use client';

import dynamic from 'next/dynamic';
import React from 'react';

/**
 * VERCEL FIX: 
 * We must use dynamic imports with { ssr: false } for any component 
 * that uses Three.js or Web Audio API. This prevents the "window is 
 * not defined" error during the Vercel build process.
 */

const NeuralCanvas = dynamic(() => import('@/components/NeuralCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-neon font-mono text-xs animate-pulse">
        BOOTING_NEURAL_ENGINE...
      </div>
    </div>
  )
});

const HUD = dynamic(() => import('@/components/HUD/Dashboard'), { 
  ssr: false 
});

const UserNode = dynamic(() => import('@/components/HUD/UserNode'), { 
  ssr: false 
});

const AudioEngine = dynamic(() => import('@/components/Audio/AudioEngine'), { 
  ssr: false 
});

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-black overflow-hidden">
      {/* 3D Visual Layer */}
      <NeuralCanvas />

      {/* Logic Layer (Audio processing) */}
      <AudioEngine />

      {/* Interface Layer */}
      <div className="relative z-10 pointer-events-none">
        <UserNode />
        <HUD />
      </div>

      {/* Global Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none" />
    </main>
  );
}
