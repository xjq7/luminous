import classNames from 'classnames';

import './iconfont.css';

export type IconType =
  | 'yuanxingweixuanzhong'
  | 'A'
  | 'huabi'
  | 'hand'
  | 'arrdown'
  | 'chuizhizhixian'
  | 'juxing'
  | 'caidan'
  | 'bangzhu'
  | 'daochu'
  | 'xiazai'
  | 'a-chexiaozhongzuoshangyibu'
  | 'a-chexiaozhongzuoxiayibu-xianxing'
  | 'xuanze'
  | 'jiahaob'
  | 'jianhao'
  | 'jianhao1'
  | 'fuzhi'
  | 'tupian'
  | 'xiayi'
  | 'shangyi'
  | 'zhidi'
  | 'top';

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  name: IconType;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

function Component(props: Props) {
  const { name, className, size = 24, style, ...restProps } = props;
  return (
    <span
      className={classNames('iconfont', 'icon-' + name, className)}
      style={{ fontSize: size, cursor: 'pointer', ...style }}
      {...restProps}
    ></span>
  );
}

export default Component;
