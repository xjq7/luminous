import Editor from './editor';
import './App.css';
import { ConfigProvider } from 'antd';
import { primaryColor } from './styles/theme';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <Editor></Editor>
    </ConfigProvider>
  );
}

export default App;
