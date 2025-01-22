import { create } from 'zustand';

export type CanvasState = 'down' | 'move' | '';

export interface CanvasStore {
  state: CanvasState;
}

const useCanvasStore = create<CanvasStore>((set) => ({
  state: '',
  setState: (state: CanvasState) => set({ state }),
}));

export default useCanvasStore;
