import { UI } from 'leafer-ui';
import { useLayoutEffect, useRef, useState } from 'react';
import useLeaferApp from './useLeaferApp';

export default function useLeaferComponent<T extends UI>(creator: () => T) {
  const creatorRef = useRef(creator);
  const leaferApp = useLeaferApp();
  const componentRef = useRef<T>();
  const [isInit, setInit] = useState(false);

  useLayoutEffect(() => {
    componentRef.current = creatorRef.current();
    setInit(true);
    leaferApp?.tree.add(componentRef.current);

    return () => {
      componentRef.current?.destroy();
      leaferApp?.tree.remove(componentRef.current);
    };
  }, [leaferApp, creatorRef.current]);

  return [componentRef.current, isInit] as [T, boolean];
}
