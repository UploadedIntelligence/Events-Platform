import { Route, Routes } from 'react-router-dom';
import { Events } from '../events.tsx';
import { CreateEvent } from './create-event.tsx';
import { UserProfile } from './user-profile';
import { AdminSettings } from './user-profile/admin-settings';
import { UserSettings } from './user-profile/user-settings.tsx';
import { EpPageContent } from '../../../components/page-content/page-content.tsx';
import { EpEventDisplay } from '../../../components/event-display/event-display.tsx';

export function UserLandingPage() {
    return (
        <EpPageContent>
            <Routes>
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/events" element={<Events />} />
                <Route path="/users/:userId/events" element={<Events />} />
                <Route path="/events/:eventId" element={<EpEventDisplay />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/admin-settings/*" element={<AdminSettings />} />
                <Route path="/user-settings" element={<UserSettings />} />
            </Routes>
        </EpPageContent>
    );
}
