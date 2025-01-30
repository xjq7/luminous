import { create, StoreApi, useStore } from 'zustand';
import { temporal, TemporalState } from 'zundo';
import { shallow } from 'zustand/shallow';
import { v4 } from 'uuid';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IZoomLayer } from '~/driver/app';
import { Cmp } from '~/interface/cmp';
import { AnyObj } from '~/utils/types';
import { swap } from '~/utils/utils';

export function debounceUpdateCmpsWithMerge(fn: any, wait: number) {
  let timer: NodeJS.Timeout | null = null;
  const cmpMaps = new Map<string, Partial<Cmp>>();
  return (cmps: Partial<Cmp>[]) => {
    cmps.forEach((cmp) => {
      cmpMaps.set(cmp.id as string, {
        ...cmpMaps.get(cmp.id as string),
        ...cmp,
      });
    });

    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      const mergeCmps: Partial<Cmp>[] = [];
      cmpMaps.forEach((cmp) => {
        mergeCmps.push(cmp);
      });
      fn(mergeCmps);
      cmpMaps.clear();
      timer = null;
    }, wait);
  };
}

export interface ModelStore {
  cmps: Cmp[];
  selectCmpIds: string[];
  zoomLayer: IZoomLayer;
  addCmp: (cmp: Cmp) => void;
  copyCmpById: (id: string) => void;
  updateCmpById: (id: string, cmp: Partial<Cmp>) => void;
  updateCmps: (cmp: Partial<Cmp>[]) => void;
  removeCmpById: (ids: string[]) => void;
  updateSelectCmpIds: (ids: string[]) => void;
  updateZoomLayer: (zoomLayer: IZoomLayer) => void;
  upwardCmp: (id: string) => void;
  downwardCmp: (id: string) => void;
  topCmp: (id: string) => void;
  bottomCmp: (id: string) => void;
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
        copyCmpById: (id: string) => {
          return set((state) => {
            const cmp = state.cmps.find((cmp) => cmp.id === id);
            if (cmp) {
              const newCmps = [...state.cmps];
              newCmps.push({
                ...cmp,
                id: v4(),
                name: '',
                x: (cmp.x || 0) + 20,
                y: (cmp.y || 0) + 20,
              });

              return { ...state, cmps: newCmps };
            }
            return state;
          });
        },
        updateCmpById: (id: string, cmp: Partial<Cmp>) => {
          return set((state) => {
            const { cmps } = state;
            const index = cmps.findIndex((cmp) => cmp.id === id);

            if (index === -1) {
              return state;
            }

            const isCmpUpdate = Object.keys(cmp).some(
              (key) =>
                (cmp as AnyObj)[key] !== (state.cmps[index] as AnyObj)[key]
            );

            if (!isCmpUpdate) return state;
            const newCmps = [...cmps];
            newCmps[index] = { ...cmps[index], ...cmp };
            return { ...state, cmps: newCmps };
          });
        },
        upwardCmp(id: string) {
          return set((state) => {
            const cmpIdx = state.cmps.findIndex((cmp) => cmp.id === id);

            if (cmpIdx === state.cmps.length - 1) return state;
            const newCmps = [...state.cmps];
            swap(newCmps, cmpIdx, cmpIdx + 1);

            return { ...state, cmps: newCmps };
          });
        },
        downwardCmp(id: string) {
          return set((state) => {
            const cmpIdx = state.cmps.findIndex((cmp) => cmp.id === id);
            if (cmpIdx === 0) return state;
            const newCmps = [...state.cmps];
            swap(newCmps, cmpIdx, cmpIdx - 1);

            return { ...state, cmps: newCmps };
          });
        },
        topCmp(id: string) {
          return set((state) => {
            const cmpIdx = state.cmps.findIndex((cmp) => cmp.id === id);
            if (cmpIdx === state.cmps.length - 1) return state;
            const newCmps = [...state.cmps];
            swap(newCmps, cmpIdx, state.cmps.length - 1);

            return { ...state, cmps: newCmps };
          });
        },
        bottomCmp(id: string) {
          return set((state) => {
            const cmpIdx = state.cmps.findIndex((cmp) => cmp.id === id);
            if (cmpIdx === 0) return state;
            const newCmps = [...state.cmps];
            swap(newCmps, cmpIdx, 0);

            return { ...state, cmps: newCmps };
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
        partialize: (state) => {
          const { zoomLayer, ...rest } = state;
          return { ...rest } as ModelStore;
        },
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
