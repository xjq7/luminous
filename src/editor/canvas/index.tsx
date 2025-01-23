import { App } from '~/driver';
import useModelStore from '~/store/model';
import { CmpRender } from './render';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import useEventHandler from './useEventHandler';
import useCanvasStore from '~/store/canvas';
import useHotkeys from './useHotkeys';

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
  const setApp = useCanvasStore((state) => state.setApp);
  const zoomLayer = useModelStore((state) => state.zoomLayer);
  const {
    onPointDown,
    onPointMove,
    onPointUp,
    onSelect,
    onPropertyChange,
    onViewMove,
    onViewZoom,
  } = useEventHandler();

  const state = useToolbarStore((state) => state.state);

  const visible = ![ToolBarState.Dragger].includes(state);

  useHotkeys();

  return (
    <App
      zoomLayer={zoomLayer}
      visible={visible}
      onPointDown={onPointDown}
      onPointMove={onPointMove}
      onPointUp={onPointUp}
      onSelect={onSelect}
      onPropertyChange={onPropertyChange}
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
