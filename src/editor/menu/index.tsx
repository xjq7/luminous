import { Dropdown, MenuProps } from 'antd';
import Iconfont from '~/components/Iconfont';
import S from './index.module.less';

export default function Menu() {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div>
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
