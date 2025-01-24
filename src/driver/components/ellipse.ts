import { PropsWithChildren } from 'react';
import { Ellipse, IEllipseInputData, PropertyEvent } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

export type EllipseProps = Omit<IEllipseInputData, 'children'> & {
  onChange?: (e: PropertyEvent) => void;
};

export default function EllipseComponent(
  props: PropsWithChildren<EllipseProps>
) {
  const [leaferEllipse] = useLeaferComponent(() => {
    const { children, onChange, ...restProps } = props;
    const leaferEllipse = new Ellipse(restProps);
    leaferEllipse.on(PropertyEvent.CHANGE, onChange);

    return leaferEllipse;
  });

  useLeaferPropsUpdate<Ellipse>(leaferEllipse, props);

  return null;
}
