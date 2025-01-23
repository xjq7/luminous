/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from 'react';
import { IPointData, PointerEvent } from 'leafer-ui';
import { useShallow } from 'zustand/react/shallow';
import useModelStore from '~/store/model';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import { CmpType } from '~/interface/cmp';
import { generateCmp } from './generator';
import { EditorEvent } from '@leafer-in/editor';
import useCanvasStore from '~/store/canvas';

export default function useEventHandler() {
  const pointDownRef = useRef<IPointData>();
  const app = useCanvasStore((state) => state.app);
  const appRef = useRef(app);

  useEffect(() => {
    appRef.current = app;
  }, [app]);

  const { setGenCmp, addCmp } = useModelStore(
    useShallow((state) => ({
      addCmp: state.addCmp,
      setGenCmp: state.setGenCmp,
    }))
  );

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

    const genCmp = useModelStore.getState().genCmp;
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
    if (!evt.value) return;
    if (Array.isArray(evt.value) && evt.value.length === 0) return;
    setState(ToolBarState.Select);
  };

  return { onPointDown, onPointMove, onPointUp, onSelect };
}
