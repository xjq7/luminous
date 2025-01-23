import { PropsWithChildren } from 'react';
import { Text, ITextInputData } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

type TextProps = Omit<ITextInputData, 'children'> & {};

export default function TextComponent(props: PropsWithChildren<TextProps>) {
  const [LeaferText] = useLeaferComponent(() => {
    const { children, ...restProps } = props;
    return new Text(restProps);
  });

  useLeaferPropsUpdate<Text>(LeaferText, props);

  return null;
}
