import { createBrowserRouter } from 'react-router';
import { App } from './App';
import { UserLandingPage } from './pages/user-landing-page/user-landing-page.route.tsx';
import { CreateEvent } from './pages/user-landing-page/create-event/create-event.route.tsx';
import { Events } from './pages/events/events.route.tsx';
import { EpEventDisplay } from './components/event-display/event-display.tsx';
import { EpNotFound } from './components/not-found/not-found.tsx';
import { CreateEventLoader } from './pages/user-landing-page/create-event/create-event-loader.tsx';
import { UserLandingPageLoader } from './pages/user-landing-page/user-landing-page-loader.ts';
import { LoginPage } from './pages/guest-landing-page/login/login.route.tsx';
import { RegisterPage } from './pages/guest-landing-page/register/register.route.tsx';
import { GuestLandingPage } from './pages/guest-landing-page/guest-landing-page.route.tsx';

export const routePaths = {
    user: {
        path: '/',
        build: (id: string) => `users/${id}`,
    },
    guest: {
        path: 'guest',
        build: () => 'guest',
    },
    login: {
        path: 'login',
        build: () => `${routePaths.guest.path}/${routePaths.login.path}`,
    },
    register: {
        path: 'register',
    },
    events: {
        path: 'events',
        build: () => `events`,
    },
    event: {
        path: ':eventId',
        build: (id: string) => `${routePaths.events.path}/${id}`,
    },
    createEvent: {
        path: 'create-event',
    },
};

const sharedRoutes = {
    path: routePaths.events.path,
    Component: Events,
    children: [
        {
            path: routePaths.event.path,
            Component: EpEventDisplay,
        },
    ],
};

export default createBrowserRouter([
    {
        Component: App,
        children: [
            {
                id: 'UserLandingPage',
                path: routePaths.user.path,
                Component: UserLandingPage,
                loader: UserLandingPageLoader,
                hasErrorBoundary: true,
                errorElement: EpNotFound(),
                children: [
                    sharedRoutes,
                    {
                        path: routePaths.createEvent.path,
                        loader: CreateEventLoader,
                        Component: CreateEvent,
                    },
                    {
                        path: '*',
                        Component: EpNotFound,
                    },
                ],
            },
            {
                id: 'GuestLandingPage',
                path: routePaths.guest.path,
                Component: GuestLandingPage,
                children: [
                    {
                        path: routePaths.login.path,
                        Component: LoginPage,
                    },
                    {
                        path: routePaths.register.path,
                        Component: RegisterPage,
                    },
                    sharedRoutes,
                ],
            },
        ],
    },
]);
