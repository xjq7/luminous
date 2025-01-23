import { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Form, MenuProps, Modal, Switch } from 'antd';
import Iconfont from '~/components/Iconfont';
import useCanvasStore from '~/store/canvas';
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/monolith.min.css';
import { primaryColor } from '~/styles/theme';
import S from './index.module.less';

export default function Menu() {
  const app = useCanvasStore((state) => state.app);
  const [exportModelOpen, setExportModelOpen] = useState(false);
  const [form] = Form.useForm();
  const colorPickerContainerRef = useRef<HTMLDivElement>(null);
  const pickrRef = useRef<Pickr | null>(null);
  const [image, setImage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(primaryColor);

  const items: MenuProps['items'] = [
    {
      key: 'save',
      label: (
        <Button
          icon={<Iconfont name="xiazai" size={18} />}
          type="text"
          onClick={() => {}}
        >
          保存
        </Button>
      ),
    },
    {
      key: 'export',
      label: (
        <Button
          icon={<Iconfont name="daochu" size={18} />}
          type="text"
          onClick={() => {
            setExportModelOpen(true);
            // app?.tree?.export('HD.png', { pixelRatio: 2 });
          }}
        >
          导出
        </Button>
      ),
    },
  ];

  const handleDownload = (type: 'png' | 'jpg') => {
    app?.export('luminous.' + type, { pixelRatio: 2, fill: backgroundColor });
  };

  const handleCreatePikcr = () => {
    if (!pickrRef.current) {
      pickrRef.current = Pickr.create({
        el: colorPickerContainerRef.current as HTMLElement,
        theme: 'monolith',
        default: primaryColor,
        components: {
          // Main components
          preview: true,
          opacity: true,
          hue: true,

          // Input / output Options
          interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            clear: true,
            save: true,
          },
        },
      });

      pickrRef.current.show();

      pickrRef.current.on('save', (pickrInstance: any) => {
        setBackgroundColor(pickrInstance.toHEXA().toString());
      });
    } else {
      pickrRef.current.show();
    }
  };

  useEffect(() => {
    return () => {
      pickrRef.current?.hide();
      pickrRef.current?.destroy();
    };
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!exportModelOpen) {
      pickrRef.current?.hide();
    }
  }, [exportModelOpen]);

  useEffect(() => {
    app?.export('jpg', { fill: backgroundColor }).then((result) => {
      setImage(result.data);
    });
  }, [exportModelOpen, app, backgroundColor]);

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomLeft" arrow>
        <div className={S.menu}>
          <Iconfont name="caidan" size={16} />
        </div>
      </Dropdown>
      <Modal
        title="导出图片"
        className={S['export-modal']}
        open={exportModelOpen}
        onCancel={() => setExportModelOpen(false)}
        footer={null}
        maskClosable={true}
        width={620}
      >
        <div className={S.content}>
          <div className={S.preview}>
            <img className={S.image} src={image} />
          </div>
          <div className={S.config}>
            <Form size="large" className={S.form} form={form}>
              <Form.Item label="背景" name="background">
                <Switch />
              </Form.Item>
              <Form.Item label="背景颜色">
                <div
                  ref={colorPickerContainerRef}
                  className={S.color}
                  style={{ backgroundColor: primaryColor }}
                  onClick={handleCreatePikcr}
                ></div>
              </Form.Item>
            </Form>

            <div className={S.operator}>
              <Button
                icon={<Iconfont name="xiazai" size={18} />}
                type="primary"
                onClick={() => {
                  handleDownload('png');
                }}
              >
                PNG
              </Button>
              <Button
                icon={<Iconfont name="xiazai" size={18} />}
                type="primary"
                onClick={() => {
                  handleDownload('jpg');
                }}
              >
                JPG
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
