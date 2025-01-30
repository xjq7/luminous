import { App } from 'leafer-ui';
import { create } from 'zustand';
import { Cmp } from '~/interface/cmp';

export interface CanvasStore {
  app: App | null;
  genCmp: Cmp | null;
  showSetting?: boolean;

  setGenCmp: (cmp: Cmp | null) => void;
  setApp: (leaferApp: App) => void;
  setShowSetting: (showSetting: boolean) => void;
}

const useCanvasStore = create<CanvasStore>((set) => ({
  app: null,
  genCmp: null,
  showSetting: false,
  setApp: (app: App) => set({ app }),
  setShowSetting: (showSetting: boolean) =>
    set((state) => ({ ...state, showSetting })),
  setGenCmp: (cmp: Cmp | null) => set((state) => ({ ...state, genCmp: cmp })),
}));

export default useCanvasStore;
