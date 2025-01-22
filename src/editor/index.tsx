import Canvas from './canvas';
import Menu from './menu';
import Settings from './settings';
import Toolbar from './toolbar';

export default function Editor() {
  return (
    <>
      <Canvas></Canvas>
      <Settings></Settings>
      <Toolbar></Toolbar>
      <Menu></Menu>
    </>
  );
}
