import './dashboard.scss';
import { type IUser } from '../../utilities/user-permissions.ts';
import dayjs from 'dayjs';
import { EventFilters } from '../../utilities/event-filters.ts';
import { NavLink, useLoaderData } from 'react-router-dom';

export function Dashboard() {
    const { user }: { user: IUser } = useLoaderData();
    const { fromDate, toDate } = EventFilters();
    const today = dayjs().format('YYYY-MM-DD-HH');

    return (
        <div className="EpDashboard">
            {
                <NavLink
                    className="EpDashboard-option"
                    to={{
                        pathname: '/create-event',
                    }}
                >
                    create event
                </NavLink>
            }
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
