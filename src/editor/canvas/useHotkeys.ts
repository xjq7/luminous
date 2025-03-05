import hotkeys from 'hotkeys-js';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import useCanvasStore from '~/store/canvas';
import useModelStore from '~/store/model';
import { CmpType, ImageCmp, TextCmp } from '~/interface/cmp';
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

    const handlePaste = async () => {
      try {
        const clipboardItems = await navigator.clipboard.read();
        const canvasWidth = app.width;
        const canvasHeight = app.height;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        let hasImagePasted = false;

        for (const item of clipboardItems) {
          if (item.types.some(type => type.startsWith('image/'))) {
            const imageType = item.types.find(type => type.startsWith('image/'));
            if (imageType) {
              const blob = await item.getType(imageType);
              const url = URL.createObjectURL(blob);

              const img = new Image();
              img.src = url;
              await new Promise(resolve => img.onload = resolve);

              const positionElement = (width: number, height: number) => ({
                x: Math.max(0, centerX - width / 2),
                y: Math.max(0, centerY - height / 2)
              });

              const { x, y } = positionElement(img.width, img.height);
              const imageCmp: ImageCmp = {
                id: genID(),
                name: 'Pasted Image',
                type: CmpType.Image,
                url,
                x,
                y,
                width: img.width,
                height: img.height,
              };

              addCmp(imageCmp);
              hasImagePasted = true;
              break;
            }
          }
        }

        if (!hasImagePasted) {
          const text = await navigator.clipboard.readText();
          if (text) {
            const positionElement = (width: number, height: number) => ({
              x: Math.max(0, centerX - width / 2),
              y: Math.max(0, centerY - height / 2)
            });

            const { x, y } = positionElement(300, 100);
            const textCmp: TextCmp = {
              id: genID(),
              name: 'Pasted Text',
              type: CmpType.Text,
              text: text,
              x,
              y,
              width: 300,
              height: 100,
              fontSize: 16,
              fontFamily: 'Arial',
              autoHeight: true,
            };

            addCmp(textCmp);
          }
        }
      } catch (error) {
        console.error('Failed to paste content:', error);
      }
    };

    hotkeys(pasteKey, handlePaste);

    return () => {
      hotkeys.unbind(delKey);
      hotkeys.unbind(copyKey);
      hotkeys.unbind(pasteKey);
    };
  }, [app, removeCmpById, copyCmpById, addCmp]);

  return;
}