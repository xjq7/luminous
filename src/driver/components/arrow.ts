import { PropsWithChildren } from 'react';
import { IArrowInputData, PropertyEvent } from 'leafer-ui';
import { Arrow } from '@leafer-in/arrow';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

export type ArrowProps = Omit<IArrowInputData, 'children'> & {
  onChange?: (e: PropertyEvent) => void;
};

export default function ArrowComponent(props: PropsWithChildren<ArrowProps>) {
  const [LeaferArrow] = useLeaferComponent(() => {
    const { children, onChange, ...restProps } = props;
    const leaferArrow = new Arrow(restProps);
    leaferArrow.on(PropertyEvent.CHANGE, onChange);
    return leaferArrow;
  });

  useLeaferPropsUpdate<Arrow>(LeaferArrow, props);

  return null;
}
