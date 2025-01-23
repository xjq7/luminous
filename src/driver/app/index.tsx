import { forwardRef, PropsWithChildren, Ref, useEffect } from 'react';
import { App as LeaferApp, UI, PointerEvent } from 'leafer-ui';
import {
  Editor,
  EditorEvent,
  EditorMoveEvent,
  EditorRotateEvent,
  EditorScaleEvent,
} from '@leafer-in/editor';
import { LeaferAppContext } from '../context';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';
import '@leafer-in/viewport';
import '@leafer-in/export';
import '@leafer-in/text-editor';

export interface AppProps {
  // 是否开启 editor
  visible?: boolean;
  hittable?: boolean;
  onPointDown?: (e: PointerEvent) => void;
  onPointUp?: (e: PointerEvent) => void;
  onPointMove?: (e: PointerEvent) => void;
  onMove?: (e: EditorMoveEvent) => void;
  onScale?: (e: EditorScaleEvent) => void;
  onRotate?: (e: EditorRotateEvent) => void;
  onSelect?: (e: EditorEvent) => void;
  onTap?: (e: PointerEvent) => void;
  onAppChange?: (app: LeaferApp) => void;
}

export interface AppRef {
  select: (targets: UI[]) => void;
  hover: (target: UI) => void;
  cancel: () => void;
  getApp: () => LeaferApp;
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
    onSelect,
    onAppChange,
    onTap,
    hittable = true,
    visible = true,
  } = props;

  const [leaferApp, isInit] = useLeaferComponent(() => {
    const app = new LeaferApp({
      view: window,
      fill: 'white',
      tree: { type: 'viewport' },
      move: {
        dragAnimate: true,
      },
    });

    app.sky = app.addLeafer();
    app.sky.add((app.editor = new Editor()));

    app.editor.on(EditorScaleEvent.SCALE, onScale);

    app.editor.on(EditorMoveEvent.MOVE, onMove);

    app.editor.on(EditorRotateEvent.ROTATE, onRotate);

    app.editor.on(EditorEvent.SELECT, onSelect);

    app.on(PointerEvent.DOWN, onPointDown);

    app.on(PointerEvent.UP, onPointUp);

    app.on(PointerEvent.TAP, onTap);

    app.on(PointerEvent.MOVE, onPointMove);

    onAppChange?.(app);

    return app;
  });

  useEffect(() => {
    if (!leaferApp) return;
    leaferApp.editor.visible = visible;
    if (leaferApp.config.move) leaferApp.config.move.drag = !visible;
  }, [visible, leaferApp]);

  useEffect(() => {
    if (!leaferApp) return;
    leaferApp.editor.hittable = hittable;
  }, [hittable, leaferApp]);

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
