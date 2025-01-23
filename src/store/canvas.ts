import { App } from 'leafer-ui';
import { create } from 'zustand';

export interface CanvasStore {
  app: App | null;
  setApp: (leaferApp: App) => void;
}

const useCanvasStore = create<CanvasStore>((set) => ({
  app: null,
  setApp: (app: App) => set({ app }),
}));

export default useCanvasStore;
