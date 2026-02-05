import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { MovieProvider } from './context/MovieContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* On enveloppe toute l'app */}
        <MovieProvider>
            <App />
        </MovieProvider>
    </StrictMode>,
);