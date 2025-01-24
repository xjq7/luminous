import { forwardRef, PropsWithChildren, useEffect, useRef } from 'react';
import {
  App as LeaferApp,
  UI,
  PointerEvent,
  ZoomEvent,
  MoveEvent,
} from 'leafer-ui';
import {
  Editor,
  EditorEvent,
  EditorMoveEvent,
  EditorRotateEvent,
  EditorScaleEvent,
} from '@leafer-in/editor';
import { usePrevious } from 'react-use';
import { LeaferAppContext } from '../context';
import useLeaferComponent from '~/driver/hooks/useLeaferComponent';
import '@leafer-in/viewport';
import '@leafer-in/export';
import '@leafer-in/text-editor';
import '@leafer-in/view';
import '@leafer-in/find';

export interface IZoomLayer {
  x?: number;
  y?: number;
  scale?: number;
}

export interface AppProps {
  // 是否开启 editor
  visible?: boolean;
  hittable?: boolean;
  zoomLayer?: IZoomLayer;
  selectCmpIds?: string[];
  onPointDown?: (e: PointerEvent) => void;
  onPointUp?: (e: PointerEvent) => void;
  onPointMove?: (e: PointerEvent) => void;
  onMove?: (e: EditorMoveEvent) => void;
  onMoveEnd?: (e: EditorMoveEvent) => void;
  onScale?: (e: EditorScaleEvent) => void;
  onScaleEnd?: (e: EditorScaleEvent) => void;
  onRotate?: (e: EditorRotateEvent) => void;
  onRotateEnd?: (e: EditorRotateEvent) => void;
  onSelect?: (e: EditorEvent) => void;
  onTap?: (e: PointerEvent) => void;
  onAppChange?: (app: LeaferApp) => void;
  onViewMove?: (e: MoveEvent) => void;
  onViewZoom?: (e: ZoomEvent) => void;
}

export interface AppRef {
  select: (targets: UI[]) => void;
  hover: (target: UI) => void;
  cancel: () => void;
  getApp: () => LeaferApp;
}

function App(props: PropsWithChildren<AppProps>) {
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
    onViewZoom,
    onViewMove,
    onMoveEnd,
    onRotateEnd,
    onScaleEnd,
    selectCmpIds = [],
    hittable = true,
    visible = true,
    zoomLayer,
  } = props;
  const moveStateRef = useRef(null);
  const scaleStateRef = useRef(null);
  const rotateStateRef = useRef(null);
  const preSelectCmpIds = usePrevious(selectCmpIds);

  const [leaferApp, isInit] = useLeaferComponent(() => {
    const handlePointUp = () => {
      if (rotateStateRef.current) {
        onRotateEnd?.(rotateStateRef.current);
        rotateStateRef.current = null;
      }
      if (moveStateRef.current) {
        onMoveEnd?.(moveStateRef.current);
        moveStateRef.current = null;
      }

      if (scaleStateRef.current) {
        onScaleEnd?.(scaleStateRef.current);
        scaleStateRef.current = null;
      }
    };

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

    app.editor.on(EditorScaleEvent.SCALE, (e) => {
      scaleStateRef.current = e;
    });

    app.editor.on(EditorMoveEvent.MOVE, onMove);

    app.editor.on(EditorMoveEvent.MOVE, (e) => {
      moveStateRef.current = e;
    });

    app.editor.on(EditorRotateEvent.ROTATE, (e) => {
      rotateStateRef.current = e;
    });

    app.editor.on(EditorRotateEvent.ROTATE, onRotate);

    app.editor.on(EditorEvent.SELECT, onSelect);

    app.tree.on(MoveEvent.MOVE, onViewMove);

    app.tree.on(ZoomEvent.ZOOM, onViewZoom);

    app.on(PointerEvent.DOWN, onPointDown);

    app.on(PointerEvent.UP, onPointUp);

    app.on(PointerEvent.UP, handlePointUp);

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

  useEffect(() => {
    if (!leaferApp) return;
    const { x, y } = zoomLayer || {};

    if (x !== undefined) {
      leaferApp.tree.x = x;
    }
    if (y !== undefined) {
      leaferApp.tree.y = y;
    }
  }, [leaferApp, zoomLayer?.x, zoomLayer?.y]);

  useEffect(() => {
    if (!leaferApp) return;
    const { scale } = zoomLayer || {};
    if (scale !== undefined) {
      leaferApp.tree.zoomLayer.scaleX = leaferApp.tree.zoomLayer.scaleY = scale;
    }
  }, [leaferApp, zoomLayer?.scale]);

  useEffect(() => {
    if (!leaferApp) return;

    if (preSelectCmpIds?.length === selectCmpIds.length) {
      if (preSelectCmpIds?.every((id) => selectCmpIds.includes(id))) {
        return;
      }
    }

    const selectedUI = selectCmpIds
      .map((id) => leaferApp.tree.findId(id))
      .filter((o) => !!o);

    leaferApp.editor.select(selectedUI);
  }, [selectCmpIds, leaferApp]);

  return (
    <LeaferAppContext.Provider value={leaferApp}>
      {isInit && children}
    </LeaferAppContext.Provider>
  );
}

export default forwardRef(App);
