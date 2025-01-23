import { App } from '~/driver';
import useModelStore from '~/store/model';
import { CmpRender } from './render';
import useToolbarStore, { ToolBarState } from '~/store/toolbar';
import useEventHandler from './useEventHandler';
import useCanvasStore from '~/store/canvas';

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
  const { onPointDown, onPointMove, onPointUp, onSelect } = useEventHandler();

  const state = useToolbarStore((state) => state.state);

  const visible = ![ToolBarState.Dragger].includes(state);

  return (
    <App
      visible={visible}
      onPointDown={onPointDown}
      onPointMove={onPointMove}
      onPointUp={onPointUp}
      onSelect={onSelect}
      onAppChange={(app) => {
        setApp(app);
      }}
    >
      <RenderCmps />
      <RenderGenCmp />
    </App>
  );
}
