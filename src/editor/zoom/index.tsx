import Iconfont from '~/components/Iconfont';
import S from './index.module.less';
import useModelStore from '~/store/model';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { Tooltip } from 'antd';

const zoomStep = 0.1;

export default function Zoom() {
  const { scale = 1, updateZoomLayer } = useModelStore(
    useShallow((state) => ({
      scale: state.zoomLayer.scale,
      updateZoomLayer: state.updateZoomLayer,
    }))
  );

  const scaleLabel = useMemo(() => {
    if (!scale) return '100%';
    const label = Math.round(scale * 100);
    return `${label}%`;
  }, [scale]);

  const handleZoom = (type: 'plus' | 'minus') => {
    if (type === 'plus') {
      if (scale >= 2.5) return;
      updateZoomLayer({ scale: scale + zoomStep });
    } else {
      if (scale <= 0.1) return;
      updateZoomLayer({ scale: scale - zoomStep });
    }
  };

  const handleResetZoom = () => {
    updateZoomLayer({ scale: 1 });
  };

  return (
    <div className={S.zoom}>
      <div
        className={S['icon-wrap']}
        onClick={() => {
          handleZoom('minus');
        }}
      >
        <Iconfont name="jianhao" size={24} />
      </div>
      <Tooltip title="重置缩放">
        <div className={S.scale} onClick={handleResetZoom}>
          {scaleLabel}
        </div>
      </Tooltip>
      <div
        className={S['icon-wrap']}
        onClick={() => {
          handleZoom('plus');
        }}
      >
        <Iconfont name="jiahaob" size={24} />
      </div>
    </div>
  );
}
