import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  likedVideos: string[];
  toggleLike: (id: string) => void;
  subscriptions: { id: string, name: string, thumbnail: string }[];
  toggleSubscription: (sub: { id: string, name: string, thumbnail: string }) => void;
  history: string[];
  addToHistory: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      likedVideos: [],
      toggleLike: (id) => set((state) => ({
        likedVideos: state.likedVideos.includes(id) 
          ? state.likedVideos.filter(v => v !== id)
          : [...state.likedVideos, id]
      })),
      
      subscriptions: [],
      toggleSubscription: (sub) => set((state) => {
        const exists = state.subscriptions.find(s => s.id === sub.id);
        return {
          subscriptions: exists
            ? state.subscriptions.filter(s => s.id !== sub.id)
            : [...state.subscriptions, sub]
        };
      }),

      history: [],
      addToHistory: (id) => set((state) => ({
        history: [id, ...state.history.filter(v => v !== id)].slice(0, 50)
      }))
    }),
    {
      name: 'nexstream-storage',
    }
  )
);