import { Button } from 'antd';
import Iconfont from '~/components/Iconfont';
import { useTemporalStore } from '~/store/model';
import S from './index.module.less';

export default function UndoRedo() {
  const { undo, redo, pastStates, futureStates } = useTemporalStore(
    (state) => state
  );

  return (
    <div className={S['undo-redo']}>
      <Button
        size="large"
        type="text"
        icon={<Iconfont name="a-chexiaozhongzuoshangyibu" size={20} />}
        onClick={() => undo()}
        disabled={pastStates.length === 0}
      />
      <Button
        size="large"
        type="text"
        icon={<Iconfont name="a-chexiaozhongzuoxiayibu-xianxing" size={20} />}
        onClick={() => redo()}
        disabled={futureStates.length === 0}
      />
    </div>
  );
}
