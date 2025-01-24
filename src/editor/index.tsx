import Canvas from './canvas';
import Menu from './menu';
import Settings from './settings';
import Toolbar from './toolbar';
import UndoRedo from './undo-redo';
import Zoom from './zoom';

export default function Editor() {
  return (
    <>
      <Canvas />
      <Settings />
      <Toolbar />
      <Menu />
      <Settings />
      <Zoom />
      <UndoRedo />
    </>
  );
}
