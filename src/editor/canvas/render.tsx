import { Rect, Text, Ellipse, Line } from '~/driver';
import { Cmp, CmpType } from '~/interface/cmp';

export function CmpRender(cmp: Cmp) {
  const { type, locked, ...restCmp } = cmp;
  const render = CmpRenderMap[type];

  const editable = !locked;

  return render({ ...restCmp, editable });
}

const CmpRenderMap: Record<CmpType, (cmp: Partial<Cmp>) => React.ReactElement> =
  {
    [CmpType.Rect]: (data) => <Rect {...data}></Rect>,
    [CmpType.Text]: (data) => <Text {...data}></Text>,
    [CmpType.Ellipse]: (data) => <Ellipse {...data}></Ellipse>,
    [CmpType.Line]: (data) => <Line {...data}></Line>,
  };

export { CmpRenderMap };
