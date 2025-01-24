import { PropsWithChildren } from 'react';
import { Text, ITextInputData, PropertyEvent } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

export type TextProps = Omit<ITextInputData, 'children'> & {
  onChange?: (e: PropertyEvent) => void;
};

export default function TextComponent(props: PropsWithChildren<TextProps>) {
  const [leaferText] = useLeaferComponent(() => {
    const { children, onChange, ...restProps } = props;
    const leaferText = new Text(restProps);
    leaferText.on(PropertyEvent.CHANGE, onChange);

    return leaferText;
  });

  useLeaferPropsUpdate<Text>(leaferText, props);

  return null;
}
