import { PropsWithChildren } from 'react';
import { Line, ILineInputData, PropertyEvent } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

export type LineProps = Omit<ILineInputData, 'children'> & {
  onChange?: (e: PropertyEvent) => void;
};

export default function Component(props: PropsWithChildren<LineProps>) {
  const [leaferLine] = useLeaferComponent(() => {
    const { children, onChange, ...restProps } = props;
    const leaferLine = new Line(restProps);

    leaferLine.on(PropertyEvent.CHANGE, onChange);
    return leaferLine;
  });

  useLeaferPropsUpdate<Line>(leaferLine, props);

  return null;
}
