import { useCallback, useMemo, useRef } from 'react';
import { PropertyEvent } from 'leafer-ui';
import throttle from 'lodash-es/throttle';

import { PROPERTY_CHANGE_THROTTLE_WAIT } from '~/constants/canvas';
import { Cmp, TextCmp } from '~/interface/cmp';
import { DeepPartial } from '~/utils/typeUtils';
import useModelStore from '~/store/model';

const PropertySetMap: Record<
  string,
  (value: any, target: any) => DeepPartial<Cmp>
> = {
  // Common
  x: (value) => ({
    x: value,
  }),
  y: (value) => ({
    y: value,
  }),
  width: (value, target) => {
    const { tag } = target;

    const cmp: DeepPartial<Cmp> = {
      width: value,
    };

    // 处理文字 自适应宽度属性
    if (tag === 'Text') {
      const autoWidth = value === undefined;

      // 当文字调整为自适应宽高时, 需要将他内部的宽高获取到
      if (autoWidth) {
        const { width } = target;
        cmp.width = width;
      }
    }
    return cmp;
  },
  height: (value, target) => {
    const { tag } = target;

    const cmp: DeepPartial<TextCmp> = {
      height: value,
    };

    // 处理文字 自适应宽度属性
    if (tag === 'Text') {
      const autoHeight = value === undefined;
      cmp.autoHeight = autoHeight;

      // 当文字调整为自适应宽高时, 需要将他内部的宽高获取到
      if (autoHeight) {
        const { height } = target;
        cmp.height = height;
      }
    }
    return cmp;
  },

  rotation: (value) => ({
    rotation: value,
  }),
  visible: (value) => ({ visible: value }),
  scaleX: (value) => ({
    scaleX: value,
  }),
  scaleY: (value) => ({
    scaleY: value,
  }),
  // Text
  text: (value: any, target: any) => {
    const { width, height } = target;
    return { width, height, text: value };
  },
};

export default function usePropertyChange() {
  const updateCmpById = useModelStore((state) => state.updateCmpById);
  const changedPropsRef = useRef<Record<string, Record<string, [any, any]>>>(
    {}
  );

  const handleChange = useCallback((e: any) => {
    const { id } = e.target as Record<string, any>;
    if (!changedPropsRef.current[id]) {
      changedPropsRef.current[id] = {};
    }
    changedPropsRef.current[id][e.attrName] = [e.newValue, e.target];
    throttleUpdate();
  }, []);

  // 这里限制更新频率，减少 React 组件渲染频率
  const throttleUpdate = useMemo(() => {
    return throttle(
      () => {
        setTimeout(() => {
          Object.keys(changedPropsRef.current).forEach((currentId) => {
            Object.keys(changedPropsRef.current[currentId]).forEach(
              (currentCmpPropName) => {
                const propertySet = PropertySetMap[currentCmpPropName];
                if (propertySet) {
                  updateCmpById(
                    currentId,
                    propertySet(
                      ...changedPropsRef.current[currentId][currentCmpPropName]
                    )
                  );
                }
              }
            );
          });
          changedPropsRef.current = {};
        }, 0);
      },
      PROPERTY_CHANGE_THROTTLE_WAIT,
      { trailing: true }
    );
  }, []);

  const onChange = (e: PropertyEvent) => {
    handleChange(e);
  };

  return { onChange };
}
