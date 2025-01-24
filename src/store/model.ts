import { create, StoreApi, useStore } from 'zustand';
import { temporal, TemporalState } from 'zundo';
import { shallow } from 'zustand/shallow';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IZoomLayer } from '~/driver/app';
import { Cmp } from '~/interface/cmp';
import { AnyObj } from '~/utils/types';

export interface ModelStore {
  cmps: Cmp[];
  selectCmpIds: string[];
  zoomLayer: IZoomLayer;
  addCmp: (cmp: Cmp) => void;
  updateCmpById: (id: string, cmp: Partial<Cmp>) => void;
  updateCmps: (cmp: Partial<Cmp>[]) => void;
  removeCmpById: (ids: string[]) => void;
  updateSelectCmpIds: (ids: string[]) => void;
  updateZoomLayer: (zoomLayer: IZoomLayer) => void;
}

const useModelStore = create<
  ModelStore,
  [
    ['zustand/persist', ModelStore],
    ['temporal', StoreApi<TemporalState<ModelStore>>]
  ]
>(
  persist(
    temporal(
      (set) => ({
        cmps: [],
        selectCmpIds: [],
        zoomLayer: {},
        addCmp: (cmp: Cmp) =>
          set((state) => ({ ...state, cmps: [...state.cmps, cmp] })),
        removeCmpById: (ids: string[]) =>
          set((state) => {
            let { cmps } = state;
            cmps = cmps.filter((cmp) => !ids.includes(cmp.id));
            return { ...state, selectCmpIds: [], cmps };
          }),
        updateCmpById: (id: string, cmp: Partial<Cmp>) => {
          return set((state) => {
            const { cmps } = state;
            const index = cmps.findIndex((cmp) => cmp.id === id);

            if (index === -1) {
              return { ...state };
            }
            cmps[index] = { ...cmps[index], ...cmp };
            return { ...state, cmps: cmps.slice() };
          });
        },
        updateCmps: (cmps: Partial<Cmp>[]) => {
          const cmpMap = cmps.reduce((acc, cur) => {
            acc.set(cur.id, cur);
            return acc;
          }, new Map());
          return set((state) => {
            const { cmps } = state;
            let isUpdate = false;
            const newCmps = cmps.map((cmp: Cmp, idx) => {
              if (cmpMap.has(cmp.id)) {
                const cmpData = cmpMap.get(cmp.id);
                const isCmpUpdate = Object.keys(cmpData).some(
                  (key) => cmpData[key] !== (cmp as AnyObj)[key]
                );
                if (isCmpUpdate) {
                  isUpdate = isCmpUpdate;
                  return { ...cmps[idx], ...cmpData };
                }
                return cmps[idx];
              }
              return cmp;
            });
            if (!isUpdate) return state;
            return { ...state, cmps: newCmps };
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
          set((state) => {
            if (state.selectCmpIds.length === ids.length) {
              if (state.selectCmpIds.every((id) => ids.includes(id)))
                return state;
            }
            return { ...state, selectCmpIds: ids };
          }),
      }),
      {
        limit: 50,
        equality: (pastState, currentState) => shallow(pastState, currentState),
      }
    ),
    {
      storage: createJSONStorage(() => localStorage),
      name: 'model-store',
    }
  )
);

export const useTemporalStore = <T>(
  selector: (state: TemporalState<ModelStore>) => T
) => useStore(useModelStore.temporal, selector);

export default useModelStore;
