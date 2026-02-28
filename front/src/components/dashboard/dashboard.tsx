import './dashboard.scss';
import { EpNavLink } from '../nav-link/nav-link.tsx';
import { canCreateEvent } from '../../utilities/user-permissions.ts';

export function Dashboard() {
    const hasPermission = canCreateEvent();

    return (
        <div className="EpDashboard">
            {hasPermission && (
                <EpNavLink variant="secondary" to="/create-event">
                    create event
                </EpNavLink>
            )}
            <EpNavLink variant="secondary" to="/discover/upcoming-events">
                upcoming events
            </EpNavLink>
            <EpNavLink variant="secondary" to="/discover/past-events">
                past events
            </EpNavLink>
            <EpNavLink variant="secondary" to="/attending">
                attending
            </EpNavLink>
        </div>
    );
}
