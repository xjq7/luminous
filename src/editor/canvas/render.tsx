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

export function CmpRender(cmp: Cmp) {
  const { type, locked, rotation = 0, ...restCmp } = cmp;
  const Render = CmpRenderMap[type];
  const editable = !locked;
  return <Render {...restCmp} rotation={rotation} editable={editable} />;
}

export function RectRender(props: RectProps) {
  return <Rect {...props}></Rect>;
}

export function EllipseRender(props: EllipseProps) {
  return <Ellipse {...props}></Ellipse>;
}

export function TextRender(props: EllipseProps) {
  return <Text {...props}></Text>;
}

export function LineRender(props: EllipseProps) {
  return <Line {...props}></Line>;
}

export function ArrowRender(props: EllipseProps) {
  return <Arrow {...props}></Arrow>;
}

export function ImageRender(props: EllipseProps) {
  return <Image {...props}></Image>;
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
