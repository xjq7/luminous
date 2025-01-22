import { PropsWithChildren } from 'react';
import { Text as LeaferText, ITextInputData } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

type TextProps = Omit<ITextInputData, 'children'> & {};

export default function Text(props: PropsWithChildren<TextProps>) {
  const [LeaferRect] = useLeaferComponent(() => {
    const { children, ...restProps } = props;
    return new LeaferText(restProps);
  });

  useLeaferPropsUpdate<LeaferText>(LeaferRect, props);

  return null;
}
