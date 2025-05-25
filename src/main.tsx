import './styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThirdwebProvider } from 'thirdweb/react';

// ThirdwebProvider will handle the client initialization

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThirdwebProvider>
        <App />
      </ThirdwebProvider>
    </BrowserRouter>
  </StrictMode>,
);
