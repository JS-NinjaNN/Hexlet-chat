import './assets/application.scss';
import ReactDOM from 'react-dom/client';
import Init from './Init.jsx';

const app = () => {
  const root = ReactDOM.createRoot(document.getElementById('chat'));
  root.render(<Init />);
};

app();
