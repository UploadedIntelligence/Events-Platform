import { Navigate, Route, Routes } from 'react-router-dom';
import { UserEvents } from './user-events.tsx';
import { CreateEvent } from './create-event.tsx';
import { UserProfile } from './user-profile';
import { AdminSettings } from './user-profile/admin-settings';
import { UserSettings } from './user-profile/user-settings.tsx';
import { EpPageContentContainer } from '../../../components/page-content-container/page-content-container.tsx';

export function UserLandingPage() {
    return (
        <EpPageContentContainer>
            <Routes>
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/discover" element={<Navigate to="/discover/upcoming-events" />} />
                <Route path="/discover/upcoming-events" element={<UserEvents eventUrl={'/upcoming-events'} />} />
                <Route path="/discover/past-events" element={<UserEvents eventUrl={'/past-events'} />} />
                <Route path="/attending" element={<UserEvents eventUrl={'/attending'} />} />
                <Route path="/user-history" element={<UserEvents eventUrl={'/user-history'} />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/admin-settings/*" element={<AdminSettings />} />
                <Route path="/user-settings" element={<UserSettings />} />
            </Routes>
        </EpPageContentContainer>
    );
}
