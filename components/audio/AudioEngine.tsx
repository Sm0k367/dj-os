'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store'; // Ensure your store path is correct

export default function AudioEngine() {
  const { volume, isMuted } = useStore();
  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return;

    // Initialize Audio Context on first user interaction
    const initAudio = () => {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNode.current = audioContext.current.createGain();
        gainNode.current.connect(audioContext.current.destination);
      }
      
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
    };

    window.addEventListener('click', initAudio);
    return () => window.removeEventListener('click', initAudio);
  }, []);

  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  return null; // This is a logic-only component
}
