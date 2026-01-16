'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Track {
  id: string;
  title: string;
  url: string;
}

interface NeuralState {
  // Auth & Profile
  user: any | null;
  profile: any | null;
  dna_xp: number;
  
  // Audio State
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  analyser: AnalyserNode | null;
  
  // Realm Geometry
  realmType: number;
  activeRealm: string;
  dnaSeed: string;
  particleCount: number;

  // Actions
  setAuth: (user: any, profile: any) => void;
  addXp: (amount: number) => void;
  setTrack: (track: Track) => void;
  togglePlay: (state?: boolean) => void;
  setVolume: (val: number) => void;
  setAnalyser: (node: AnalyserNode) => void;
  setRealm: (type: number, trackName: string) => void;
}

export const useStore = create<NeuralState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      profile: null,
      dna_xp: 0,
      currentTrack: null,
      isPlaying: false,
      volume: 0.8,
      analyser: null,
      realmType: 0,
      activeRealm: 'NEURAL_CORE',
      dnaSeed: '0x000000',
      particleCount: 15000,

      // Actions
      setAuth: (user, profile) => set({ user, profile }),
      
      addXp: (amount) => set((state) => ({ dna_xp: state.dna_xp + amount })),

      setTrack: (track) => {
        // Generate a hex seed based on track title
        const seed = '0x' + Array.from(track.title)
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
          .toString(16).padStart(6, '0');
        
        set({ currentTrack: track, dnaSeed: seed, isPlaying: true });
      },

      togglePlay: (state) => set((prev) => ({ 
        isPlaying: state !== undefined ? state : !prev.isPlaying 
      })),

      setVolume: (val) => set({ volume: val }),

      setAnalyser: (node) => set({ analyser: node }),

      setRealm: (type, trackName) => {
        const realms = [
          'TORUS_KNOT', 'DNA_ARCHIVE', 'QUANTUM_FOAM', 'NEURAL_GRID',
          'VOID_SPHERE', 'HYPER_TUBE', 'DATA_STREAM', 'PULSE_WAVE',
          'COSMIC_DUST', 'SILICON_VALLEY', 'VECTOR_FIELD', 'QUANTUM_PRINGLE'
        ];
        set({ realmType: type, activeRealm: realms[type] || 'UNKNOWN_SECTOR' });
      },
    }),
    {
      name: 'neural-vault-storage', // Key in LocalStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist these specific fields (Don't persist the AnalyserNode or Audio state)
      partialize: (state) => ({ 
        dna_xp: state.dna_xp,
        realmType: state.realmType,
        activeRealm: state.activeRealm,
        volume: state.volume,
        dnaSeed: state.dnaSeed
      }),
    }
  )
);
