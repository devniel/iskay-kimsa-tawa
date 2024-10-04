import { Script } from 'app/models';
import { create } from 'zustand';

interface StoreState {
  // Define your state properties here
  script: Script | null;
}

interface StoreActions {
  // Define your action methods here
}

const useStore = create<StoreState & StoreActions>((set) => ({
  // Initialize your state and define your actions here
  // Example:
  // count: 0,
  // increment: () => set((state) => ({ count: state.count + 1 })),
  script: null,
  setScript: (script: any) => set({ script }),
}));

export default useStore;
