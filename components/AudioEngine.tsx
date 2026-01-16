'use client';

import React, { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export default function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    setAnalyser, 
    togglePlay, 
    setRealm, 
    realmType 
  } = useStore();

  useEffect(() => {
    if (!audioRef.current) return;

    // 1. Initialize Web Audio API on first interaction
    const initAudio = () => {
      if (useStore.getState().analyser) return; // Already init

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256; // High resolution for smooth particle pulsing

      const source = audioCtx.createMediaElementSource(audioRef.current!);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      setAnalyser(analyser);
    };

    // Trigger init on play
    if (isPlaying) {
      initAudio();
      audioRef.current.play().catch(() => togglePlay(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setAnalyser, togglePlay]);

  // 2. Handle Track Changes & Seed Generation
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.play();
      
      // Auto-morph the realm based on the new track DNA
      // We cycle through 12 realms or use the database realmType
      setRealm(realmType || 0, currentTrack.title);
    }
  }, [currentTrack, setRealm, realmType]);

  // 3. Sync Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <audio
      ref={audioRef}
      className="hidden"
      crossOrigin="anonymous"
      onEnded={() => togglePlay(false)}
    />
  );
}
