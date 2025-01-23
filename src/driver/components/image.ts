import { PropsWithChildren } from 'react';
import { Image, IImageInputData } from 'leafer-ui';
import useLeaferPropsUpdate from '~/driver/hooks/useLeaferPropsUpdate';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';

type ImageProps = Omit<IImageInputData, 'children'> & {};

export default function ImageComponent(props: PropsWithChildren<ImageProps>) {
  const [LeaferImage] = useLeaferComponent(() => {
    const { children, ...restProps } = props;
    return new Image(restProps);
  });

  useLeaferPropsUpdate<Image>(LeaferImage, props);

  return null;
}
