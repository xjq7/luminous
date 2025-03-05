import hotkeys from 'hotkeys-js';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import useCanvasStore from '~/store/canvas';
import useModelStore from '~/store/model';
import { CmpType, ImageCmp } from '~/interface/cmp';
import { v4 as genID } from 'uuid';

export default function useHotkeys() {
  const app = useCanvasStore((state) => state.app);

  const { removeCmpById, copyCmpById, addCmp } = useModelStore(
    useShallow((state) => ({
      removeCmpById: state.removeCmpById,
      copyCmpById: state.copyCmpById,
      addCmp: state.addCmp,
    }))
  );

  useEffect(() => {
    const delKey = 'backspace';
    const copyKey = 'ctrl+c,command+c';
    const pasteKey = 'ctrl+v,command+v';

    hotkeys(delKey, () => {
      removeCmpById(useModelStore.getState().selectCmpIds);
    });

    hotkeys(copyKey, () => {
      const selectCmpIds = useModelStore.getState().selectCmpIds;
      if (selectCmpIds.length > 0) {
        copyCmpById(selectCmpIds[0]);
      }
    });

    hotkeys(pasteKey, async () => {
      try {
        const clipboardItems = await navigator.clipboard.read();
        
        for (const item of clipboardItems) {
          // Check if the clipboard has image data
          if (item.types.some(type => type.startsWith('image/'))) {
            // Get the image type that's available
            const imageType = item.types.find(type => type.startsWith('image/'));
            if (imageType) {
              const blob = await item.getType(imageType);
              const url = URL.createObjectURL(blob);
              
              // Create image element to get dimensions
              const img = new Image();
              img.src = url;
              
              await new Promise((resolve) => {
                img.onload = resolve;
              });
              
              // Create and add the image component to the canvas
              const imageCmp: ImageCmp = {
                id: genID(),
                name: 'Pasted Image',
                type: CmpType.Image,
                url,
                x: 100,
                y: 100,
                width: img.width,
                height: img.height,
              };
              
              addCmp(imageCmp);
            }
          }
        }
      } catch (error) {
        console.error('Failed to read clipboard contents:', error);
      }
    });

    return () => {
      hotkeys.unbind(delKey);
      hotkeys.unbind(copyKey);
      hotkeys.unbind(pasteKey);
    };
  }, [app, removeCmpById, copyCmpById, addCmp]);

  return;
}