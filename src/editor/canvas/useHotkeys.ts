import hotkeys from 'hotkeys-js';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import useCanvasStore from '~/store/canvas';
import useModelStore from '~/store/model';

export default function useHotkeys() {
  const app = useCanvasStore((state) => state.app);
  const { removeCmpById } = useModelStore(
    useShallow((state) => ({
      removeCmpById: state.removeCmpById,
    }))
  );

  useEffect(() => {
    const delKey = 'backspace';

    hotkeys(delKey, () => {
      console.log(useModelStore.getState().selectCmpIds);

      removeCmpById(useModelStore.getState().selectCmpIds);
    });

    return () => {
      hotkeys.unbind(delKey);
    };
  }, [app]);

  return;
}
