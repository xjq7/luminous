import { App } from '~/driver';
import useModelStore from '~/store/model';
import { CmpRender } from './render';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import useEventHandler from './useEventHandler';
import useCanvasStore from '~/store/canvas';
import useHotkeys from './useHotkeys';
import { useShallow } from 'zustand/react/shallow';

function RenderGenCmp() {
  const genCmp = useCanvasStore((state) => state.genCmp);

  if (!genCmp) return null;
  return <CmpRender {...genCmp}></CmpRender>;
}

function RenderCmps() {
  const { cmps } = useModelStore();

  return cmps.map((cmp, index) => {
    return <CmpRender key={cmp.id} zIndex={index} {...cmp}></CmpRender>;
  });
}

export default function Canvas() {
  const setApp = useCanvasStore((state) => state.setApp);
  const { zoomLayer, selectCmpIds } = useModelStore(
    useShallow((state) => ({
      zoomLayer: state.zoomLayer,
      selectCmpIds: state.selectCmpIds,
    }))
  );
  const {
    onPointDown,
    onPointMove,
    onPointUp,
    onSelect,
    onViewMove,
    onViewZoom,
    onMoveEnd,
    onScaleEnd,
    onRotateEnd,
  } = useEventHandler();

  const state = useToolbarStore((state) => state.state);

  const visible = ![ToolBarState.Dragger].includes(state);

  useHotkeys();

  return (
    <App
      zoomLayer={zoomLayer}
      visible={visible}
      selectCmpIds={selectCmpIds}
      onPointDown={onPointDown}
      onPointMove={onPointMove}
      onPointUp={onPointUp}
      onSelect={onSelect}
      onMoveEnd={onMoveEnd}
      onScaleEnd={onScaleEnd}
      onRotateEnd={onRotateEnd}
      onViewMove={onViewMove}
      onViewZoom={onViewZoom}
      onAppChange={(app) => {
        setApp(app);
      }}
    >
      <RenderCmps />
      <RenderGenCmp />
    </App>
  );
}
