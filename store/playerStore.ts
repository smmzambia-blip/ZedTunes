import { create } from 'zustand';

interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverImage?: string;
}

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  playSong: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  
  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  resume: () => set((state) => ({ isPlaying: state.currentSong !== null })),
  setVolume: (volume) => set({ volume }),
}));
