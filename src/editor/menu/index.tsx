import { useEffect, useState } from 'react';
import { Button, Dropdown, Form, MenuProps, Modal, Switch } from 'antd';
import Iconfont from '~/components/Iconfont';
import useCanvasStore from '~/store/canvas';
import { primaryColor } from '~/styles/theme';
import ColorPicker from '~/components/ColorPicker';
import S from './index.module.less';

export default function Menu() {
  const app = useCanvasStore((state) => state.app);
  const [exportModelOpen, setExportModelOpen] = useState(false);
  const [form] = Form.useForm();
  const [image, setImage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(primaryColor);
  const enabledBackground = Form.useWatch(['background'], form);

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
    app?.export('luminous.' + type, {
      pixelRatio: 2,
      fill: enabledBackground ? backgroundColor : 'transparent',
    });
  };

  useEffect(() => {
    let bgColor = backgroundColor;

    if (!enabledBackground) {
      bgColor = 'transparent';
    }

    app?.export('png', { fill: bgColor }).then((result) => {
      setImage(result.data);
    });
  }, [exportModelOpen, app, backgroundColor, enabledBackground]);

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
                <ColorPicker
                  value={primaryColor}
                  onChange={(value) => setBackgroundColor(value)}
                />
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
