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

    hotkeys(pasteKey, async () => {
      try {
        const clipboardItems = await navigator.clipboard.read();
        let hasImagePasted = false;

        for (const item of clipboardItems) {
          if (item.types.some(type => type.startsWith('image/'))) {
            const imageType = item.types.find(type => type.startsWith('image/'));
            if (imageType) {
              const blob = await item.getType(imageType);
              const url = URL.createObjectURL(blob);

              const img = new Image();
              img.src = url;

              await new Promise((resolve) => {
                img.onload = resolve;
              });

              const imageCmp: ImageCmp = {
                id: genID(),
                name: 'Pasted Image',
                type: CmpType.Image,
                url,
                width: img.width,
                height: img.height,
              };

              const canvasWidth = app?.width || 400;
              const canvasHeight = app?.height || 400;
              imageCmp.x = (canvasWidth - imageCmp.width) / 2;
              imageCmp.y = (canvasHeight - imageCmp.height) / 2;

              addCmp(imageCmp);
              hasImagePasted = true;
              break;
            }
          } else if (item.types.includes('text/plain') && !hasImagePasted) {
            const textBlob = await item.getType('text/plain');
            const text = await textBlob.text();

            const textCmp: TextCmp = {
              id: genID(),
              name: 'Pasted Text',
              type: CmpType.Text,
              text: text,
              width: 300,
              height: 100,
              fontSize: 16,
              fontFamily: 'Arial',
              autoHeight: true,
            };

            const canvasWidth = app?.width || 400;
            const canvasHeight = app?.height || 400;
            textCmp.x = (canvasWidth - textCmp.width) / 2;
            textCmp.y = (canvasHeight - textCmp.height) / 2;

            addCmp(textCmp);
            break;
          }
        }

        if (!hasImagePasted && clipboardItems.length === 0) {
          const text = await navigator.clipboard.readText();
          if (text) {
            const textCmp: TextCmp = {
              id: genID(),
              name: 'Pasted Text',
              type: CmpType.Text,
              text: text,
              width: 300,
              height: 100,
              fontSize: 16,
              fontFamily: 'Arial',
              autoHeight: true,
            };

            const canvasWidth = app?.width || 400;
            const canvasHeight = app?.height || 400;
            textCmp.x = (canvasWidth - textCmp.width) / 2;
            textCmp.y = (canvasHeight - textCmp.height) / 2;

            addCmp(textCmp);
          }
        }
      } catch (error) {
        console.error('Failed to read clipboard contents:', error);

        try {
          const text = await navigator.clipboard.readText();
          if (text) {
            const textCmp: TextCmp = {
              id: genID(),
              name: 'Pasted Text',
              type: CmpType.Text,
              text: text,
              width: 300,
              height: 100,
              fontSize: 16,
              fontFamily: 'Arial',
              autoHeight: true,
            };

            const canvasWidth = app?.width || 400;
            const canvasHeight = app?.height || 400;
            textCmp.x = (canvasWidth - textCmp.width) / 2;
            textCmp.y = (canvasHeight - textCmp.height) / 2;

            addCmp(textCmp);
          }
        } catch (textError) {
          console.error('Failed to read clipboard text:', textError);
        }
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
