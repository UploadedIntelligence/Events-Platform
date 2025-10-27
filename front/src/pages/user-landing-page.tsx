import '../styles/nav-bar.scss';
import authClient from '../services/auth-client.ts';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserEvents } from './user-events.tsx';
import { CreateEvent } from './create-event.tsx';
import { UserSettings } from '../components/user-settings.tsx';
import { NavBar } from '../components/nav-bar.tsx';

export function UserLandingPage() {
    const { data } = authClient.useSession();

    console.log(data);

    return (
        <div>
            {data ? <NavBar /> : <Navigate to="/login" />}
            <Routes>
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/upcoming-events" element={<UserEvents eventUrl={'/upcoming-events'} />} />
                <Route path="/past-events" element={<UserEvents eventUrl={'/past-events'} />} />
                <Route path="/attending" element={<UserEvents eventUrl={'/attending'} />} />
                <Route path="/user-settings" element={<UserSettings />} />
            </Routes>
        </div>
    );
}
