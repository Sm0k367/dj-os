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
      // Check if already initialized
      if (useStore.getState().analyser) return;

      try {
        // Check if AudioContext is available (browser compatibility)
        const AudioContextClass = typeof window !== 'undefined' 
          ? (window.AudioContext || (window as any).webkitAudioContext)
          : null;

        if (!AudioContextClass) {
          console.warn('AudioContext not available in this browser');
          return;
        }

        const audioCtx = new AudioContextClass();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256; // High resolution for smooth particle pulsing

        if (!audioRef.current) return;

        const source = audioCtx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        setAnalyser(analyser);
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
        togglePlay(false);
      }
    };

    // Trigger init on play
    if (isPlaying) {
      initAudio();
      audioRef.current.play().catch((error) => {
        console.error('Failed to play audio:', error);
        togglePlay(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setAnalyser, togglePlay]);

  // 2. Handle Track Changes & Seed Generation
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      try {
        audioRef.current.src = currentTrack.url;
        audioRef.current.play().catch((error) => {
          console.error('Failed to play track:', error);
          togglePlay(false);
        });

        // Auto-morph the realm based on the new track DNA
        // We cycle through 12 realms or use the database realmType
        setRealm(realmType || 0, currentTrack.title);
      } catch (error) {
        console.error('Failed to load track:', error);
        togglePlay(false);
      }
    }
  }, [currentTrack, setRealm, realmType, togglePlay]);

  // 3. Sync Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  // 4. Handle audio errors
  const handleAudioError = (error: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audioElement = error.currentTarget;
    console.error('Audio error:', audioElement.error?.message);
    togglePlay(false);
  };

  return (
    <audio
      ref={audioRef}
      className="hidden"
      crossOrigin="anonymous"
      onEnded={() => togglePlay(false)}
      onError={handleAudioError}
      preload="metadata"
    />
  );
}
