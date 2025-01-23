import { PropsWithChildren } from 'react';
import { Line, ILineInputData } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

type LineProps = Omit<ILineInputData, 'children'> & {};

export default function Component(props: PropsWithChildren<LineProps>) {
  const [LeaferLine] = useLeaferComponent(() => {
    const { children, ...restProps } = props;
    return new Line(restProps);
  });

  useLeaferPropsUpdate<Line>(LeaferLine, props);

  return null;
}
