import classNames from 'classnames';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import Iconfont, { IconType } from '~/components/Iconfont';

import S from './index.module.less';
import { useRef } from 'react';

interface Icon {
  name: string;
  size: number;
  type: ToolBarState;
  onClick: () => void;
}

export default function Toolbar() {
  const { state, setState } = useToolbarStore();
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
      name: 'tupian',
      size: 20,
      type: ToolBarState.Image,
      onClick: () => {},
    },
  ];

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
      <input ref={inputRef} style={{ display: 'none' }} />
    </div>
  );
}
