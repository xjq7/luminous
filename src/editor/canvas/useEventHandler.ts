/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from 'react';
import {
  IPointData,
  IUI,
  MoveEvent,
  PointerEvent,
  UI,
  ZoomEvent,
} from 'leafer-ui';
import { useShallow } from 'zustand/react/shallow';
import useModelStore, { debounceUpdateCmpsWithMerge } from '~/store/model';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import { Cmp, CmpType } from '~/interface/cmp';
import { generateCmp } from './generator';
import {
  EditorEvent,
  EditorMoveEvent,
  EditorRotateEvent,
  EditorScaleEvent,
} from '@leafer-in/editor';
import useCanvasStore from '~/store/canvas';
import debounce from 'lodash-es/debounce';

export default function useEventHandler() {
  const pointDownRef = useRef<IPointData>();
  const { app, setGenCmp } = useCanvasStore(
    useShallow((state) => ({ app: state.app, setGenCmp: state.setGenCmp }))
  );
  const appRef = useRef(app);

  useEffect(() => {
    appRef.current = app;
  }, [app]);

  const { addCmp, updateZoomLayer, updateSelectCmpIds, updateCmps } =
    useModelStore(
      useShallow((state) => ({
        addCmp: state.addCmp,
        updateZoomLayer: state.updateZoomLayer,
        updateSelectCmpIds: state.updateSelectCmpIds,
        updateCmps: state.updateCmps,
      }))
    );

  const debounceUpdateCmps = debounceUpdateCmpsWithMerge(updateCmps, 100);

  const setState = useToolbarStore((state) => state.setState);

  const onPointDown = (e: PointerEvent) => {
    const point = e.getPagePoint();
    const toolbarState = useToolbarStore.getState().state;

    if (toolbarState === ToolBarState.Text) {
      setGenCmp(
        generateCmp(CmpType.Text, {
          startX: point.x,
          startY: point.y,
          endX: point.x,
          endY: point.y,
        })
      );

      return;
    }

    pointDownRef.current = point;

    if (appRef.current?.editor.selector) {
      //@ts-ignore
      appRef.current.editor.selector.hoverStroker.visible = false;
    }
  };
  const onPointMove = (e: PointerEvent) => {
    const point = e.getPagePoint();
    const toolbarState = useToolbarStore.getState().state;

    if ([ToolBarState.Dragger, ToolBarState.Select].includes(toolbarState))
      return;

    if (appRef.current) appRef.current.editor.visible = false;
    const { x, y } = point;
    if (!pointDownRef.current) return;
    const { x: startX, y: startY } = pointDownRef.current;

    let cmpType: CmpType = CmpType.Rect;

    switch (toolbarState) {
      case ToolBarState.Rect:
        cmpType = CmpType.Rect;
        break;
      case ToolBarState.Ellipse:
        cmpType = CmpType.Ellipse;
        break;
      case ToolBarState.Text:
        cmpType = CmpType.Text;
        break;
      case ToolBarState.Line:
        cmpType = CmpType.Line;
        break;
      case ToolBarState.Arrow:
        cmpType = CmpType.Arrow;
        break;
      default:
    }

    setGenCmp(
      generateCmp(cmpType, {
        startX,
        startY,
        endX: x,
        endY: y,
      })
    );
  };
  const onPointUp = () => {
    pointDownRef.current = undefined;

    const genCmp = useCanvasStore.getState().genCmp;
    if (genCmp) {
      addCmp({ ...genCmp, locked: false });
      setGenCmp(null);
      setState(ToolBarState.Select);
    }

    if (appRef.current) {
      appRef.current.editor.visible = true;
    }

    if (appRef.current?.editor.selector) {
      //@ts-ignore
      appRef.current.editor.selector.hoverStroker.visible = true;
    }
  };

  const onSelect = (evt: EditorEvent) => {
    if (!evt.value) {
      updateSelectCmpIds([]);
      return;
    }
    if (Array.isArray(evt.value) && evt.value.length === 0) return;
    const selectEl = evt.value;

    if (selectEl) {
      let selectEls: IUI[] = [];
      if (!Array.isArray(selectEl)) {
        selectEls = [selectEl];
      } else {
        selectEls = selectEl;
      }

      updateSelectCmpIds(selectEls.map((el) => el.id as string));
    }

    setState(ToolBarState.Select);
  };

  const onViewMove = debounce((evt: MoveEvent) => {
    const { x, y } = evt.target.zoomLayer || {};
    updateZoomLayer({ x, y });
  }, 500);

  const onViewZoom = debounce((evt: ZoomEvent) => {
    if (!evt.target.zoomLayer) return;
    updateZoomLayer({ scale: evt.target.zoomLayer.scaleX });
  }, 500);

  const onMoveEnd = (evt: EditorMoveEvent) => {
    let target = (evt.current as any).leafList.list as UI[];

    if (!Array.isArray(target)) {
      target = [target];
    }
    const cmps = target.map((cmp) => ({ id: cmp.id, x: cmp.x, y: cmp.y }));
    debounceUpdateCmps(cmps);
  };

  const onScaleEnd = (evt: EditorScaleEvent) => {
    let target = (evt.current as any).leafList.list as UI[];

    if (!Array.isArray(target)) {
      target = [target];
    }
    const cmps = target.map((cmp) => ({
      id: cmp.id,
      width: cmp.width,
      height: cmp.height,
    }));
    debounceUpdateCmps(cmps);
  };

  const onRotateEnd = (evt: EditorRotateEvent) => {
    let target = (evt.current as any).leafList.list as UI[];

    if (!Array.isArray(target)) {
      target = [target];
    }
    const cmps = target.map((cmp) => ({
      id: cmp.id,
      rotation: cmp.rotation,
    }));
    debounceUpdateCmps(cmps);
  };

  return {
    onPointDown,
    onPointMove,
    onPointUp,
    onSelect,
    onMoveEnd,
    onScaleEnd,
    onRotateEnd,
    onViewMove,
    onViewZoom,
  };
}
