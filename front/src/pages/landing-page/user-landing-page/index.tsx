import '../../../styles/nav-bar.scss';
import '../../../App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserEvents } from './user-events.tsx';
import { CreateEvent } from './create-event.tsx';
import { UserProfile } from './user-profile';
import { NavBar } from '../../../components/nav-bar.tsx';
import { AdminSettings } from './user-profile/admin-settings';
import { UserSettings } from './user-profile/user-settings.tsx';
import { getSession } from '../../../utilities/user-permissions.ts';
import { BackgroundPaper } from '../../../mui-styled-components';

export function UserLandingPage() {
    const user = getSession();
    return (
        <BackgroundPaper>
            {user ? <NavBar /> : <Navigate to="/login" />}
            <Routes>
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/upcoming-events" element={<UserEvents eventUrl={'/upcoming-events'} />} />
                <Route path="/past-events" element={<UserEvents eventUrl={'/past-events'} />} />
                <Route path="/attending" element={<UserEvents eventUrl={'/attending'} />} />
                <Route path="/user-history" element={<UserEvents eventUrl={'/user-history'} />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/admin-settings/*" element={<AdminSettings />} />
                <Route path="/user-settings" element={<UserSettings />} />
            </Routes>
        </BackgroundPaper>
    );
}
