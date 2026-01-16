import { create } from 'zustand';

interface AppState {
  // Audio State
  volume: number;
  isMuted: boolean;
  setVolume: (val: number) => void;
  toggleMute: () => void;

  // UI / OS State
  isBooted: boolean;
  setBooted: (val: boolean) => void;
  activeWindow: string | null;
  setActiveWindow: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  // Defaults
  volume: 75,
  isMuted: false,
  isBooted: false,
  activeWindow: null,

  // Actions
  setVolume: (val) => set({ volume: val }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setBooted: (val) => set({ isBooted: val }),
  setActiveWindow: (id) => set({ activeWindow: id }),
}));
