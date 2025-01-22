import { PropsWithChildren } from 'react';
import { Line, ILineInputData } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

type RectangleProps = Omit<ILineInputData, 'children'> & {};

export default function Rectangle(props: PropsWithChildren<RectangleProps>) {
  const [LeaferRect] = useLeaferComponent(() => {
    const { children, ...restProps } = props;
    return new Line(restProps);
  });

  useLeaferPropsUpdate<Line>(LeaferRect, props);

  return null;
}
