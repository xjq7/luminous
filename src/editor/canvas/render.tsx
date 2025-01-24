import {
  Rect,
  Text,
  Ellipse,
  Line,
  Arrow,
  Image,
  RectProps,
  EllipseProps,
} from '~/driver';
import { Cmp, CmpType } from '~/interface/cmp';
import usePropertyChange from './usePropertyChange';

export function CmpRender(cmp: Cmp) {
  const { type, locked, ...restCmp } = cmp;
  const render = CmpRenderMap[type];

  const editable = !locked;

  return render({ ...restCmp, editable });
}

export function RectRender(props: RectProps) {
  const { onChange } = usePropertyChange();
  return <Rect {...props} onChange={onChange}></Rect>;
}

export function EllipseRender(props: EllipseProps) {
  const { onChange } = usePropertyChange();
  return <Ellipse {...props} onChange={onChange}></Ellipse>;
}

export function TextRender(props: EllipseProps) {
  const { onChange } = usePropertyChange();
  return <Text {...props} onChange={onChange}></Text>;
}

export function LineRender(props: EllipseProps) {
  const { onChange } = usePropertyChange();
  return <Line {...props} onChange={onChange}></Line>;
}

export function ArrowRender(props: EllipseProps) {
  const { onChange } = usePropertyChange();
  return <Arrow {...props} onChange={onChange}></Arrow>;
}

export function ImageRender(props: EllipseProps) {
  const { onChange } = usePropertyChange();
  return <Image {...props} onChange={onChange}></Image>;
}

const CmpRenderMap: Record<CmpType, (cmp: Partial<Cmp>) => React.ReactElement> =
  {
    [CmpType.Rect]: RectRender,
    [CmpType.Text]: TextRender,
    [CmpType.Ellipse]: EllipseRender,
    [CmpType.Line]: LineRender,
    [CmpType.Arrow]: ArrowRender,
    [CmpType.Image]: ImageRender,
  };

export { CmpRenderMap };
