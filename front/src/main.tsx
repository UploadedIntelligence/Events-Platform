import './style-reset.scss';
import './index.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../src/services/tanstack-query-client.ts';
import router from './routes.ts';

const root = document.getElementById('root');

createRoot(root!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>,
);
