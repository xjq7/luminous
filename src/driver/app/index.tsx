import {
  forwardRef,
  PropsWithChildren,
  Ref,
  useEffect,
  useImperativeHandle,
} from 'react';
import { App as LeaferApp, UI, PointerEvent } from 'leafer-ui';
import {
  Editor,
  EditorMoveEvent,
  EditorRotateEvent,
  EditorScaleEvent,
} from '@leafer-in/editor';
import { LeaferAppContext } from '../context';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';
import '@leafer-in/viewport';

export interface AppProps {
  visible?: boolean;
  onPointDown?: (e: PointerEvent) => void;
  onPointUp?: (e: PointerEvent) => void;
  onPointMove?: (e: PointerEvent) => void;

  onMove?: (e: EditorMoveEvent) => void;
  onScale?: (e: EditorScaleEvent) => void;
  onRotate?: (e: EditorRotateEvent) => void;
}

interface AppRef {
  select: (targets: UI[]) => void;
  hover: (target: UI) => void;
}

function App(props: PropsWithChildren<AppProps>, ref: Ref<AppRef>) {
  const {
    children,
    onPointUp,
    onPointDown,
    onMove,
    onRotate,
    onScale,
    onPointMove,
  } = props;

  const [leaferApp, isInit] = useLeaferComponent(() => {
    const app = new LeaferApp({
      view: window,
      fill: 'white',
      tree: { type: 'viewport' },
    });

    app.sky = app.addLeafer();
    app.sky.add((app.editor = new Editor()));

    app.editor.on(EditorScaleEvent.SCALE, onScale);

    app.editor.on(EditorMoveEvent.MOVE, onMove);

    app.editor.on(EditorRotateEvent.ROTATE, onRotate);

    app.on(PointerEvent.DOWN, onPointDown);

    app.on(PointerEvent.UP, onPointUp);

    app.on(PointerEvent.TAP, (e: PointerEvent) => {
      console.log(e);
    });

    app.on(PointerEvent.MOVE, onPointMove);

    return app;
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        select(target: UI[]) {
          leaferApp.editor.select(target);
        },
        cancel() {
          leaferApp.editor.cancel();
        },
        hover(target: UI) {
          leaferApp.editor.select(target);
        },
      };
    },
    []
  );

  useEffect(() => {
    return () => {
      leaferApp?.destroy();
    };
  }, [leaferApp]);

  return (
    <LeaferAppContext.Provider value={leaferApp}>
      {isInit && children}
    </LeaferAppContext.Provider>
  );
}

export default forwardRef(App);
