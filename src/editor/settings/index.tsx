import { useMemo } from 'react';
import { Form, Slider } from 'antd';
import { useShallow } from 'zustand/shallow';
import useModelStore from '~/store/model';
import Iconfont from '~/components/Iconfont';
import ColorPicker from '~/components/ColorPicker';
import { AnyObj } from '~/utils/types';
import S from './index.module.less';

export default function Settings() {
  const {
    selectCmpIds,
    cmps,
    updateCmpById,
    upwardCmp,
    downwardCmp,
    topCmp,
    bottomCmp,
    removeCmpById,
    copyCmpById,
  } = useModelStore(
    useShallow((state) => ({
      selectCmpIds: state.selectCmpIds,
      cmps: state.cmps,
      updateCmps: state.updateCmps,
      updateCmpById: state.updateCmpById,
      upwardCmp: state.upwardCmp,
      downwardCmp: state.downwardCmp,
      topCmp: state.topCmp,
      bottomCmp: state.bottomCmp,
      removeCmpById: state.removeCmpById,
      copyCmpById: state.copyCmpById,
    }))
  );

  const show = useMemo(() => selectCmpIds.length === 1, [selectCmpIds]);

  const selectCmpId = useMemo(() => {
    if (selectCmpIds.length !== 1) return null;
    return selectCmpIds[0];
  }, [selectCmpIds]);

  const selectCmp = useMemo(() => {
    if (selectCmpIds.length !== 1) return;
    const cmp = cmps.find((cmp) => cmp.id === selectCmpIds[0]);
    return cmp;
  }, [selectCmpIds, cmps]);

  const handleOpacityChange = (value: number) => {
    if (!selectCmp) return;
    updateCmpById(selectCmp.id, { opacity: value });
  };

  const handleSettingsChange = (obj: AnyObj) => {
    if (!selectCmp) return;
    updateCmpById(selectCmp.id, obj);
  };

  if (!selectCmp || !selectCmpId) return null;

  const { opacity = 1, fill = '', stroke = '' } = selectCmp;

  return (
    <div
      className={S.settings}
      style={{ display: show ? 'block' : 'none' }}
      key={selectCmpId}
    >
      <Form layout="vertical">
        <Form.Item label="填充">
          <ColorPicker
            value={fill as string}
            onChange={(value: string) => {
              handleSettingsChange({ fill: value });
            }}
          />
        </Form.Item>
        <Form.Item label="描边">
          <ColorPicker
            value={stroke as string}
            onChange={(value: string) => {
              handleSettingsChange({ stroke: value });
            }}
          />
        </Form.Item>

        <Form.Item label="透明度">
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={opacity}
            onChange={handleOpacityChange}
          ></Slider>
        </Form.Item>
        <Form.Item label="图层">
          <div className={S.layer}>
            <Iconfont
              name="top"
              size={22}
              onClick={() => topCmp(selectCmp?.id as string)}
            />
            <Iconfont
              name="shangyi"
              size={20}
              onClick={() => upwardCmp(selectCmp?.id as string)}
            />
            <Iconfont
              name="xiayi"
              size={20}
              onClick={() => downwardCmp(selectCmp?.id as string)}
            />
            <Iconfont
              name="zhidi"
              size={22}
              onClick={() => bottomCmp(selectCmp?.id as string)}
            />
          </div>
        </Form.Item>
        <Form.Item label="操作">
          <div className={S.operator}>
            <Iconfont
              name="fuzhi"
              size={22}
              onClick={() => {
                copyCmpById(selectCmpId);
              }}
            />
            <Iconfont
              name="shanchu"
              size={22}
              onClick={() => {
                removeCmpById([selectCmpId]);
              }}
            />
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
