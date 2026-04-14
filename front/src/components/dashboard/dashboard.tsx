import './dashboard.scss';
import { canCreateEvent, getSession } from '../../utilities/user-permissions.ts';
import dayjs from 'dayjs';
import { EventFilters } from '../../utilities/event-filters.ts';
import { NavLink } from 'react-router-dom';

export function Dashboard() {
    const user = getSession();
    const { fromDate, toDate } = EventFilters();
    const today = dayjs().format('YYYY-MM-DD-HH');
    const hasPermission = canCreateEvent();

    return (
        <div className="EpDashboard">
            {hasPermission && (
                <NavLink
                    className="EpDashboard-option"
                    to={{
                        pathname: '/create-event',
                    }}
                >
                    create event
                </NavLink>
            )}
            <NavLink
                className={({ isActive }) => `EpDashboard-option ${isActive && fromDate ? 'active' : ''}`}
                to={{
                    pathname: `/users/${user?.id}/events`,
                    search: `fromDate=${today}`,
                }}
            >
                attending
            </NavLink>
            <NavLink
                className={({ isActive }) => `EpDashboard-option ${isActive && toDate ? 'active' : ''}`}
                to={{
                    pathname: `/users/${user?.id}/events`,
                    search: `toDate=${today}`,
                }}
            >
                history
            </NavLink>
        </div>
    );
}
