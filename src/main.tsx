import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.tsx';
import './assets/fonts/fonts.css';
import './assets/fonts/tailwind-fonts.css';
import './index.css';
import './utils/i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
