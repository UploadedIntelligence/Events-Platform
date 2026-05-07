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

//check if documentation has a way of accessing route objects similar to routePaths
export const routePaths = {
    main: {
        path: '/',
    },
    user: {
        path: 'users/:userId',
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
    attendance: {
        path: 'attendance',
        build: (id: string) => `${routePaths.event.build(id)}/${routePaths.attendance.path}`,
    },
    createEvent: {
        path: 'create-event',
    },
};

// for creating url paths for server requests
export const apiClient = {};

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
                path: routePaths.main.path,
                Component: UserLandingPage,
                loader: UserLandingPageLoader,
                children: [
                    sharedRoutes,
                    {
                        path: routePaths.user.path,
                        children: [
                            {
                                path: routePaths.events.path,
                                Component: Events,
                            },
                        ],
                    },
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
