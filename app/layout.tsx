import type { Metadata } from 'next';
import { Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import AudioEngine from '@/components/AudioEngine';
import NeuralCanvas from '@/components/NeuralCanvas';
import Dashboard from '@/components/HUD/Dashboard';

const techMono = Share_Tech_Mono({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap' 
});

export const metadata: Metadata = {
  title: 'NEURAL_VAULT_OS // DJ Smoke Stream',
  description: 'A procedural multiverse for audio & digital DNA.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={techMono.className}>
        {/* 1. THE 3D ENGINE (Background) */}
        <NeuralCanvas />

        {/* 2. THE AUDIO SYSTEM (Logic) */}
        <AudioEngine />

        {/* 3. THE INTERFACE (Foreground) */}
        <Dashboard />

        {/* 4. THE PAGE CONTENT (Auth/Gallery/etc.) */}
        <main className="relative z-20">
          {children}
        </main>
      </body>
    </html>
  );
}
