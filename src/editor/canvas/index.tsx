import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { PointerEvent } from 'leafer-ui';
import { App } from '~/driver';
import useModelStore from '~/store/model';
import { CmpRender } from './render';
import useCanvasStore from '~/store/canvas';
import { generateCmp } from '~/editor/generator';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import { CmpType } from '~/interface/cmp';

function RenderGenCmp() {
  const { genCmp } = useModelStore((state) => state);

  if (!genCmp) return null;
  return CmpRender(genCmp);
}

function RenderCmps() {
  const cmps = useModelStore((state) => state.cmps);

  return cmps.map((cmp) => {
    return CmpRender(cmp);
  });
}

export default function Canvas() {
  const { setGenCmp, addCmp } = useModelStore(
    useShallow((state) => ({
      addCmp: state.addCmp,
      setGenCmp: state.setGenCmp,
    }))
  );

  const pointDownRef = useRef<PointerEvent>();

  return (
    <>
      <App
        onPointDown={(e: PointerEvent) => {
          pointDownRef.current = e;
          useCanvasStore.setState({
            state: 'down',
          });
        }}
        onPointMove={(e: PointerEvent) => {
          if (useCanvasStore.getState().state !== 'down') {
            return;
          }

          const toolbarState = useToolbarStore.getState().state;

          if (toolbarState === ToolBarState.Dragger) return;

          const { x, y } = e;
          if (!pointDownRef.current) return;
          const { x: startX, y: startY } = pointDownRef.current;

          let cmpX = startX + 1;
          let cmpY = startY + 1;
          let width = x - startX;
          let height = y - startY;

          if (x < startX) {
            cmpX = x;
            width = startX - x;
          }

          if (y < startY) {
            cmpY = y;
            height = startY - y;
          }

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
            default:
          }

          useModelStore.setState({
            genCmp: generateCmp(cmpType, {
              x: cmpX,
              y: cmpY,
              width,
              height,
              fill: 'lime',
              stroke: 'lime',
            }),
          });
        }}
        onPointUp={() => {
          pointDownRef.current = undefined;
          if (useCanvasStore.getState().state !== 'down') {
            return;
          }

          useCanvasStore.setState({
            state: '',
          });

          const genCmp = useModelStore.getState().genCmp;

          if (genCmp) addCmp(genCmp);
          setGenCmp(null);
        }}
      >
        <RenderCmps />
        <RenderGenCmp />
      </App>
    </>
  );
}
