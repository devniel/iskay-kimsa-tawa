import { Script } from '@/models';
import { fetchScript } from '@/services/api';
import { create } from 'zustand';

interface StoreState {
  script: Script | null;
  status: 'idle' | 'loading' | 'error';
}

interface StoreActions {
  setScript: (script: Script) => void;
  setStatus: (status: 'idle' | 'loading' | 'error') => void;
  loadScript: () => void;
}

const useStore = create<StoreState & StoreActions>((set) => ({
  script: null,
  setScript: (script: Script) => set({ script }),
  status: 'idle',
  setStatus: (status: 'idle' | 'loading' | 'error') => set({ status }),
  loadScript: async () => {
    set({ status: 'loading' });
    const script = await fetchScript();
    set({ script, status: 'idle' });
  },
}));

export default useStore;
