import classNames from 'classnames';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import Iconfont, { IconType } from '~/components/Iconfont';

import S from './index.module.less';
import { useRef } from 'react';
import useModelStore from '~/store/model';
import { CmpType, ImageCmp } from '~/interface/cmp';
import { generateCmp } from '../canvas/generator';
import { message } from 'antd';

interface Icon {
  name: string;
  size: number;
  type: ToolBarState;
  onClick: () => void;
}

export default function Toolbar() {
  const { state, setState } = useToolbarStore();
  const addCmp = useModelStore((state) => state.addCmp);
  const inputRef = useRef<HTMLInputElement>(null);

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

      addCmp({
        ...generateCmp(CmpType.Image, {
          startX: 200,
          startY: 200,
          endX: 400,
          endY: 400,
        }),
        url: base64String,
      } as ImageCmp);
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
