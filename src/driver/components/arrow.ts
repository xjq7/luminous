import { PropsWithChildren } from 'react';
import { IArrowInputData } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';
import { Arrow } from '@leafer-in/arrow';

type ArrowProps = Omit<IArrowInputData, 'children'> & {};

export default function ArrowComponent(props: PropsWithChildren<ArrowProps>) {
  const [LeaferArrow] = useLeaferComponent(() => {
    const { children, ...restProps } = props;
    return new Arrow(restProps);
  });

  useLeaferPropsUpdate<Arrow>(LeaferArrow, props);

  return null;
}
