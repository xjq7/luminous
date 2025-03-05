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
        // First try to read clipboard data with the Clipboard API
        const clipboardItems = await navigator.clipboard.read();
        let hasImagePasted = false;
        
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
              hasImagePasted = true;
              break;
            }
          }
          // Check if clipboard has text data and no image was pasted
          else if (item.types.includes('text/plain') && !hasImagePasted) {
            const textBlob = await item.getType('text/plain');
            const text = await textBlob.text();
            
            // Create text component with reasonable defaults
            const textCmp: TextCmp = {
              id: genID(),
              name: 'Pasted Text',
              type: CmpType.Text,
              text: text,
              x: 100,
              y: 100,
              width: 300,
              height: 100,
              fontSize: 16,
              fontFamily: 'Arial',
              autoHeight: true,
            };
            
            addCmp(textCmp);
            break;
          }
        }

        // If no image or text from clipboard items, try readText as fallback
        if (!hasImagePasted && clipboardItems.length === 0) {
          const text = await navigator.clipboard.readText();
          if (text) {
            const textCmp: TextCmp = {
              id: genID(),
              name: 'Pasted Text',
              type: CmpType.Text,
              text: text,
              x: 100,
              y: 100,
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
        console.error('Failed to read clipboard contents:', error);
        
        // Try text-only clipboard as a fallback
        try {
          const text = await navigator.clipboard.readText();
          if (text) {
            const textCmp: TextCmp = {
              id: genID(),
              name: 'Pasted Text',
              type: CmpType.Text,
              text: text,
              x: 100,
              y: 100,
              width: 300,
              height: 100,
              fontSize: 16,
              fontFamily: 'Arial',
              autoHeight: true,
            };
            
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