import { create } from 'zustand';

interface NeuralState {
  // --- AUTH & PROFILE ---
  user: any | null;
  profile: any | null;
  setAuth: (user: any, profile: any) => void;

  // --- AUDIO ENGINE ---
  isPlaying: boolean;
  currentTrack: {
    title: string;
    url: string;
    id: string;
  } | null;
  volume: number;
  analyser: AnalyserNode | null;
  setTrack: (track: any) => void;
  setAnalyser: (analyser: AnalyserNode) => void;
  togglePlay: (val?: boolean) => void;

  // --- MULTIVERSE SETTINGS ---
  activeRealm: string;
  realmType: number; // 0-11 for the 12+ types
  dnaSeed: string;
  particleCount: number;
  setRealm: (type: number, title: string) => void;

  // --- UI CONTROLS ---
  isPosterMode: boolean;
  activeTab: 'visualizer' | 'gallery' | 'editor' | 'profile';
  setTab: (tab: any) => void;
}

export const useStore = create<NeuralState>((set) => ({
  user: null,
  profile: null,
  setAuth: (user, profile) => set({ user, profile }),

  isPlaying: false,
  currentTrack: null,
  volume: 0.8,
  analyser: null,
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  setAnalyser: (analyser) => set({ analyser }),
  togglePlay: (val) => set((state) => ({ isPlaying: val !== undefined ? val : !state.isPlaying })),

  activeRealm: "NEURAL_VOID",
  realmType: 0,
  dnaSeed: "0x000000",
  particleCount: 15000,
  setRealm: (type, title) => {
    // Generate a hex seed based on the song title
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = `0x${Math.abs(hash).toString(16).toUpperCase().slice(0, 6)}`;
    set({ realmType: type, activeRealm: title, dnaSeed: seed });
  },

  isPosterMode: false,
  activeTab: 'visualizer',
  setTab: (tab) => set({ activeTab: tab }),
}));
