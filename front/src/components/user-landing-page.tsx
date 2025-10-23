import '../styles/nav-bar.scss';
import authClient from '../services/auth-client.ts';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FetchEvents } from './fetch-events.tsx';
import { CreateEventPage } from '../pages/create-event.tsx';
import { UserSettings } from './user-settings.tsx';
import { NavBar } from './nav-bar.tsx';

export function UserLandingPage() {
    const { data } = authClient.useSession();

    console.log(data);

    return (
        <div>
            {data ? <NavBar /> : <Navigate to="/login" />}
            <Routes>
                <Route path="/create-event" element={<CreateEventPage />} />
                <Route path="/upcoming-events" element={<FetchEvents event_type={'/upcoming-events'} />} />
                <Route path="/past-events" element={<FetchEvents event_type={'/past-events'} />} />
                <Route path="/attending" element={<FetchEvents event_type={'/attending'} />} />
                <Route path="/user-settings" element={<UserSettings />} />
            </Routes>
        </div>
    );
}
