import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './utils/i18n';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeModeProvider } from './context/ThemeModeProvider'
import './utils/use-tailwind/useTailwind.css';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeModeProvider>
      <App />
    </ThemeModeProvider>
  </React.StrictMode>
);

function getInitialThemeMode() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('themeMode');
    if (stored === 'light' || stored === 'dark') return stored;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  return 'light';
}

const currentMode = getInitialThemeMode();
document.body.classList.add(currentMode);

reportWebVitals();


