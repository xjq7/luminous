import { useEffect, useRef } from 'react';
import Pickr from '@simonwep/pickr';
import S from './index.module.less';

interface Props {
  value: string;
  onChange?: (value: string) => void;
}

export default function ColorPicker(props: Props) {
  const { value, onChange } = props;
  const colorPickerContainerRef = useRef<HTMLDivElement>(null);
  const pickrRef = useRef<Pickr | null>();

  useEffect(() => {
    if (!colorPickerContainerRef.current) return;
    const child = document.createElement('div');
    colorPickerContainerRef.current?.appendChild(child);
    pickrRef.current = Pickr.create({
      el: child,
      theme: 'monolith',
      default: value,
      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          hsva: true,
          cmyk: true,
          input: true,
          clear: true,
          save: true,
        },
      },
    });

    pickrRef.current.on('save', (pickrInstance: any) => {
      if (pickrInstance) {
        onChange?.(pickrInstance.toHEXA()?.toString());
      } else {
        onChange?.('');
      }
    });

    return () => {
      pickrRef.current?.destroyAndRemove();
    };
  }, []);

  useEffect(() => {
    const pickrColor = pickrRef.current?.getColor().toHEXA().toString();
    if (value === pickrColor) return;
    pickrRef.current?.setColor(value);
  }, [value]);

  return <div ref={colorPickerContainerRef} className={S.pickr}></div>;
}
