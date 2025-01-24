import { App } from 'leafer-ui';
import { create } from 'zustand';
import { Cmp } from '~/interface/cmp';

export interface CanvasStore {
  app: App | null;
  genCmp: Cmp | null;
  
  setGenCmp: (cmp: Cmp | null) => void;
  setApp: (leaferApp: App) => void;
}

const useCanvasStore = create<CanvasStore>((set) => ({
  app: null,
  genCmp: null,
  setApp: (app: App) => set({ app }),
  setGenCmp: (cmp: Cmp | null) => set((state) => ({ ...state, genCmp: cmp })),
}));

export default useCanvasStore;
