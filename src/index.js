import ReactDOM from 'react-dom/client';
import { Offline, Online } from 'react-detect-offline';
import { Alert } from 'antd';

import App from './components/app';

import './index.css';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <>
    <Online>
      <App />
    </Online>
    <Offline>
      <Alert message="ВНИМАНИЕ!" description="Отсутсвует подключение к интернету" type="warning" showIcon />
    </Offline>
  </>
);
