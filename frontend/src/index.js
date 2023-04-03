import './styles/application.scss';
import './styles/style.css';
import ReactDOM from 'react-dom/client';
import Init from './Init.jsx';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('chat'));
  root.render(await Init());
};

app();
