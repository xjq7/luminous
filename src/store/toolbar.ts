import { create } from 'zustand';

export enum ToolBarState {
  Select,
  Dragger,
  Text,
  Rect,
  Ellipse,
  Arrow,
  Line,
  Image,
}

export interface ToolBarStore {
  state: ToolBarState;
  setState: (state: ToolBarState) => void;
}

const useToolbarStore = create<ToolBarStore>((set) => ({
  state: ToolBarState.Dragger,

  setState: (state: ToolBarState) => set({ state }),
}));

export default useToolbarStore;
