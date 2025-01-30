import { PropsWithChildren } from 'react';
import { Path, ILineInputData, PropertyEvent } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

export type PathProps = Omit<ILineInputData, 'children'> & {
  onChange?: (e: PropertyEvent) => void;
};

export default function Component(props: PropsWithChildren<PathProps>) {
  const [leaferPath] = useLeaferComponent(() => {
    const { children, onChange, ...restProps } = props;
    const leaferPath = new Path(restProps);

    leaferPath.on(PropertyEvent.CHANGE, onChange);
    return leaferPath;
  });

  useLeaferPropsUpdate<Path>(leaferPath, props);

  return null;
}
