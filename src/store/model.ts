import { create } from 'zustand';
import { Cmp } from '~/interface/cmp';

export interface ModelStore {
  cmps: Cmp[];
  genCmp: Cmp | null;
  selectCmpId: string;
  addCmp: (cmp: Cmp) => void;
  setGenCmp: (cmp: Cmp | null) => void;
}

const useModelStore = create<ModelStore>((set) => ({
  cmps: [],
  genCmp: null,
  selectCmpId: '',
  setGenCmp: (cmp: Cmp | null) => set((state) => ({ ...state, genCmp: cmp })),
  addCmp: (cmp: Cmp) =>
    set((state) => ({ ...state, cmps: [...state.cmps, cmp] })),
  removeCmpById: (id: string) =>
    set((state) => {
      let { cmps } = state;
      cmps = cmps.filter((cmp) => cmp.id !== id);
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
}));

export default useModelStore;
