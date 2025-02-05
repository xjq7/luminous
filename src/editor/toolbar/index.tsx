import { useMemo, useRef } from 'react';
import classNames from 'classnames';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import Iconfont, { IconType } from '~/components/Iconfont';
import { message } from 'antd';
import useModelStore from '~/store/model';
import { CmpType, ImageCmp } from '~/interface/cmp';
import { generateCmp } from '../canvas/generator';
import { useShallow } from 'zustand/shallow';
import useCanvasStore from '~/store/canvas';
import S from './index.module.less';

interface Icon {
  name: string;
  size: number;
  type: ToolBarState;
  onClick: () => void;
}

export default function Toolbar() {
  const { state, setState } = useToolbarStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const { addCmp, zoomLayer } = useModelStore(
    useShallow((state) => ({
      zoomLayer: state.zoomLayer,
      addCmp: state.addCmp,
    }))
  );

  const app = useCanvasStore((state) => state.app);

  const centerPosition = useMemo(() => {
    const { x = 0, y = 0, scale = 1 } = zoomLayer;

    const appWidth = app?.canvas.width;
    const appHeight = app?.canvas.height;

    if (appWidth && appHeight && scale !== undefined) {
      // const centerX = (appWidth * scale - (x || 0)) / 2;
      // const centerY = (appHeight * scale - (y || 0)) / 2;
      const centerX = ((appWidth - (x || 0)) * scale) / 2;
      const centerY = ((appHeight - (y || 0)) * scale) / 2;

      return { x: centerX, y: centerY };
    }

    return { x: 0, y: 0 };
  }, [zoomLayer, app]);

  const icons: Icon[] = [
    {
      name: 'hand',
      size: 18,
      type: ToolBarState.Dragger,
      onClick: () => {
        setState(ToolBarState.Dragger);
      },
    },
    {
      name: 'xuanze',
      size: 18,
      type: ToolBarState.Select,
      onClick: () => {
        setState(ToolBarState.Select);
      },
    },
    {
      name: 'juxing',
      size: 18,
      type: ToolBarState.Rect,
      onClick: () => {
        setState(ToolBarState.Rect);
      },
    },
    {
      name: 'yuanxingweixuanzhong',
      size: 19,
      type: ToolBarState.Ellipse,
      onClick: () => {
        setState(ToolBarState.Ellipse);
      },
    },
    {
      name: 'A',
      size: 20,
      type: ToolBarState.Text,
      onClick: () => {
        setState(ToolBarState.Text);
      },
    },
    {
      name: 'chuizhizhixian',
      size: 20,
      type: ToolBarState.Line,
      onClick: () => {
        setState(ToolBarState.Line);
      },
    },
    {
      name: 'arrdown',
      size: 20,
      type: ToolBarState.Arrow,
      onClick: () => {
        setState(ToolBarState.Arrow);
      },
    },
    {
      name: 'huabi',
      size: 20,
      type: ToolBarState.Pen,
      onClick: () => {
        setState(ToolBarState.Pen);
      },
    },
    {
      name: 'tupian',
      size: 20,
      type: ToolBarState.Image,
      onClick: () => {
        inputRef.current?.click();
      },
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
      const base64String = event.target?.result;

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = function () {
        addCmp({
          ...generateCmp(CmpType.Image, {
            startX: centerPosition.x - img.width / 2,
            startY: centerPosition.y - img.height / 2,
            endX: 200 + centerPosition.x,
            endY: (img.height / img.width) * 200 + centerPosition.y,
          }),
          url: base64String,
        } as ImageCmp);

        // 释放对象 URL
        URL.revokeObjectURL(url);
      };

      img.src = url;
    };

    reader.onerror = function () {
      message.error('图片读取失败!');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className={S.toolbar}>
      {icons.map((icon) => {
        return (
          <div
            className={classNames(S.icon, state === icon.type && S.active)}
            onClick={icon.onClick}
          >
            <Iconfont name={icon.name as IconType} size={icon.size} />
          </div>
        );
      })}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        multiple={false}
        onChange={handleInputChange}
      />
    </div>
  );
}
