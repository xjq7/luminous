import { Dropdown, MenuProps } from 'antd';
import Iconfont from '~/components/Iconfont';
import S from './index.module.less';
import useCanvasStore from '~/store/canvas';

export default function Menu() {
  const app = useCanvasStore((state) => state.app);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div
          onClick={() => {
            app?.tree?.export('HD.png', { pixelRatio: 2 });
          }}
        >
          <span>导出</span>
        </div>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft" arrow>
      <div className={S.menu}>
        <Iconfont name="caidan" size={16} />
      </div>
    </Dropdown>
  );
}
