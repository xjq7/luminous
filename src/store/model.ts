import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IZoomLayer } from '~/driver/app';
import { Cmp } from '~/interface/cmp';

export interface ModelStore {
  cmps: Cmp[];
  genCmp: Cmp | null;
  selectCmpIds: string[];
  zoomLayer: IZoomLayer;
  addCmp: (cmp: Cmp) => void;
  setGenCmp: (cmp: Cmp | null) => void;
  updateCmpById: (id: string, cmp: Partial<Cmp>) => void;
  removeCmpById: (ids: string[]) => void;
  updateSelectCmpIds: (ids: string[]) => void;
  updateZoomLayer: (zoomLayer: IZoomLayer) => void;
}

const useModelStore = create<ModelStore, [['zustand/persist', ModelStore]]>(
  persist<ModelStore>(
    (set) => ({
      cmps: [],
      genCmp: null,
      selectCmpIds: [],
      zoomLayer: {},
      setGenCmp: (cmp: Cmp | null) =>
        set((state) => ({ ...state, genCmp: cmp })),
      addCmp: (cmp: Cmp) =>
        set((state) => ({ ...state, cmps: [...state.cmps, cmp] })),
      removeCmpById: (ids: string[]) =>
        set((state) => {
          let { cmps } = state;
          cmps = cmps.filter((cmp) => !ids.includes(cmp.id));
          return { cmps };
        }),
      updateCmpById: (id: string, cmp: Partial<Cmp>) => {
        return set((state) => {
          const { cmps } = state;
          const index = cmps.findIndex((cmp) => cmp.id === id);

          if (index === -1) {
            return { ...state };
          }

          cmps[index] = { ...cmps[index], ...cmp };

          return { cmps: cmps.slice() };
        });
      },
      updateZoomLayer(zoomLayer: IZoomLayer) {
        return set((state) => {
          return {
            ...state,
            zoomLayer: { ...state.zoomLayer, ...zoomLayer },
          };
        });
      },
      updateSelectCmpIds: (ids: string[]) =>
        set((state) => ({ ...state, selectCmpIds: ids })),
    }),
    {
      name: 'model-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useModelStore;
