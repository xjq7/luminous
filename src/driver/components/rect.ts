import { PropsWithChildren } from 'react';
import { Rect, IRectInputData, PropertyEvent } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

export type RectProps = Omit<IRectInputData, 'children'> & {
  onChange?: (e: PropertyEvent) => void;
};

export default function Rectangle(props: PropsWithChildren<RectProps>) {
  const [leaferRect] = useLeaferComponent(() => {
    const { children, onChange, ...restProps } = props;
    const leaferRect = new Rect(restProps);
    leaferRect.on(PropertyEvent.CHANGE, onChange);

    return leaferRect;
  });

  useLeaferPropsUpdate<Rect>(leaferRect, props);

  return null;
}
