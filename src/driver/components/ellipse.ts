import { PropsWithChildren } from 'react';
import { Ellipse, IEllipseInputData } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

type EllipseProps = Omit<IEllipseInputData, 'children'> & {};

export default function Rectangle(props: PropsWithChildren<EllipseProps>) {
  const [LeaferRect] = useLeaferComponent(() => {
    const { children, ...restProps } = props;
    return new Ellipse(restProps);
  });

  useLeaferPropsUpdate<Ellipse>(LeaferRect, props);

  return null;
}
