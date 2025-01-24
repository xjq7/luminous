import { PropsWithChildren } from 'react';
import { Image, IImageInputData, PropertyEvent } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

export type ImageProps = Omit<IImageInputData, 'children'> & {
  onChange?: (e: PropertyEvent) => void;
};

export default function ImageComponent(props: PropsWithChildren<ImageProps>) {
  const [leaferImage] = useLeaferComponent(() => {
    const { children, onChange, ...restProps } = props;
    const leaferImage = new Image(restProps);
    leaferImage.on(PropertyEvent.CHANGE, onChange);

    return leaferImage;
  });

  useLeaferPropsUpdate<Image>(leaferImage, props);

  return null;
}
