import './style-reset.scss';
import './index.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import queryClient from '../src/services/tanstack-query-client.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
);
