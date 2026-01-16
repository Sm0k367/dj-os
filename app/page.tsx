'use client';

import dynamic from 'next/dynamic';
import HUD from '@/components/HUD/Dashboard';
import AudioEngine from '@/components/Audio/AudioEngine';
import UserNode from '@/components/HUD/UserNode';

// 1. DYNAMIC IMPORT: This is the crucial fix for Vercel
// We disable SSR (Server Side Rendering) for the 3D Canvas
const NeuralCanvas = dynamic(() => import('@/components/NeuralCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
      <div className="w-12 h-12 border-2 border-neon border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-neon font-mono text-[10px] tracking-[0.3em] animate-pulse">
        INITIALIZING_NEURAL_CORE...
      </p>
    </div>
  )
});

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-black overflow-hidden">
      {/* The 3D Engine - Only loads on the client */}
      <NeuralCanvas />

      {/* The Audio Engine - Logic only */}
      <AudioEngine />

      {/* Interface Layers */}
      <div className="relative z-10">
        <UserNode />
        <HUD />
      </div>

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none" />
    </main>
  );
}
