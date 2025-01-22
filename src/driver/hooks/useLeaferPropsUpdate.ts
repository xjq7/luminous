import { useEffect } from 'react';
import { UI } from 'leafer-ui';
import { AnyObj } from '~/utils/types';
import { usePrevious } from 'react-use';

export default function usePropsUpdate<T extends UI>(
  leaferInstance: T | undefined,
  props: AnyObj
) {
  const lastProps = usePrevious(props) as AnyObj;

  useEffect(() => {
    if (!leaferInstance) return;

    for (const key in props) {
      if (lastProps[key] !== props[key]) {
        leaferInstance.setAttr(key, props[key]);
      }
    }
  }, [props, leaferInstance]);

  return null;
}
