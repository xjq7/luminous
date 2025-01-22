import { PropsWithChildren } from 'react';
import { Rect, IRectInputData } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

type RectangleProps = Omit<IRectInputData, 'children'> & {};

export default function Rectangle(props: PropsWithChildren<RectangleProps>) {
  const [LeaferRect] = useLeaferComponent(() => {
    const { children, ...restProps } = props;
    return new Rect(restProps);
  });

  useLeaferPropsUpdate<Rect>(LeaferRect, props);

  return null;
}
