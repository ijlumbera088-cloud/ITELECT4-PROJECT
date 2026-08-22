import create from 'zustand';

interface UiState {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  toggleDarkMode: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  darkMode: false,
  setDarkMode: (v: boolean) => set({ darkMode: v }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}));
