import { ConfigProvider } from 'antd';
import Editor from './editor';

import { primaryColor } from './styles/theme';
import './App.css';
import Github from './components/Github';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <Editor />
      <Github />
    </ConfigProvider>
  );
}

export default App;
