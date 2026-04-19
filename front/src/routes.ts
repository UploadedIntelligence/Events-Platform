import { createBrowserRouter } from 'react-router';
import { App } from './App';
import { LandingPage } from './pages/landing-page/landing-page.route.tsx';
import { LoginPage } from './pages/landing-page/login/login.route.tsx';
import { RegisterPage } from './pages/landing-page/register/register.route.tsx';
import { CreateEvent } from './pages/landing-page/create-event/create-event.route.tsx';
import { Events } from './pages/landing-page/events/events.route.tsx';
import { EpEventDisplay } from './components/event-display/event-display.tsx';
import { EpNotFound } from './components/not-found/not-found.tsx';
import { CreateEventLoader } from './pages/landing-page/create-event/create-event-loader.tsx';
import { LandingPageLoader } from './pages/landing-page/landing-page-loader.ts';

export default createBrowserRouter([
    {
        Component: App,
        children: [
            {
                id: 'LandingPage',
                Component: LandingPage,
                loader: LandingPageLoader,
                children: [
                    {
                        path: 'login',
                        Component: LoginPage,
                    },
                    {
                        path: 'register',
                        Component: RegisterPage,
                    },
                    {
                        path: 'events',
                        Component: Events,
                        children: [
                            {
                                path: ':eventId',
                                Component: EpEventDisplay,
                            },
                        ],
                    },
                    {
                        path: 'users/:userId/events',
                        Component: Events,
                    },
                    {
                        path: 'create-event',
                        loader: CreateEventLoader,
                        Component: CreateEvent,
                    },
                    {
                        path: '*',
                        Component: EpNotFound,
                    },
                ],
            },
        ],
    },
]);
