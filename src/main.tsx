import './utils/storage.ts';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Guard against unhandled promise rejections and cross-origin resource hiccups
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Gracefully handle background sync or network timeouts without breaking UI execution
    if (!event.reason || event.reason.message?.includes('offline') || event.reason.message?.includes('network') || event.reason.name === 'FirebaseError') {
      event.preventDefault();
      console.warn('Recovered from unhandled network/storage rejection:', event.reason);
    }
  });

  window.addEventListener('error', (event) => {
    if (!event.error || !event.message || event.message === 'Script error.') {
      // Prevent cross-origin/external script empty errors from bubbling
      event.preventDefault();
      console.warn('Recovered from benign script/resource load error:', event);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Application Display Notice">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

