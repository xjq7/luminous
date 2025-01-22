import classNames from 'classnames';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import Iconfont, { IconType } from '~/components/Iconfont';

import S from './index.module.less';

interface Icon {
  name: string;
  size: number;
  type: ToolBarState;
}

const icons: Icon[] = [
  {
    name: 'hand',
    size: 18,
    type: ToolBarState.Dragger,
  },
  {
    name: 'juxing',
    size: 18,
    type: ToolBarState.Rect,
  },
  {
    name: 'yuanxingweixuanzhong',
    size: 19,
    type: ToolBarState.Ellipse,
  },

  {
    name: 'chuizhizhixian',
    size: 20,
    type: ToolBarState.Line,
  },
];

export default function Toolbar() {
  const { state, setState } = useToolbarStore();

  return (
    <div className={S.toolbar}>
      {icons.map((icon) => {
        return (
          <div
            className={classNames(S.icon, state === icon.type && S.active)}
            onClick={() => setState(icon.type)}
          >
            <Iconfont name={icon.name as IconType} size={icon.size} />
          </div>
        );
      })}
    </div>
  );
}
