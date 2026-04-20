import './dashboard.scss';
import dayjs from 'dayjs';
import { EventFilters } from '../../utilities/event-filters.ts';
import { NavLink, useLoaderData, useNavigation } from 'react-router-dom';
import { routePaths } from '../../routes.ts';

export function Dashboard() {
    const navigation = useNavigation();
    const isNavigating = Boolean(navigation.location);
    const { userCanCreateEvent }: { userCanCreateEvent: boolean } = useLoaderData();
    const { fromDate, toDate } = EventFilters();
    const today = dayjs().format('YYYY-MM-DD-HH');

    return (
        <div className="EpDashboard">
            {userCanCreateEvent && (
                <NavLink
                    className={({ isActive, isPending }) =>
                        `EpDashboard-option ${(isActive && !isNavigating) || isPending ? 'active' : ''}`
                    }
                    to={{
                        pathname: routePaths.createEvent.path,
                    }}
                >
                    create event
                </NavLink>
            )}
            <NavLink
                className={({ isActive, isPending }) =>
                    `EpDashboard-option ${(isActive && fromDate && !isNavigating) || (isPending && navigation.location?.search.includes('?fromDate')) ? 'active' : ''}`
                }
                to={{
                    pathname: routePaths.events.path,
                    search: `fromDate=${today}`,
                }}
                viewTransition
            >
                attending
            </NavLink>
            <NavLink
                className={({ isActive, isPending }) =>
                    `EpDashboard-option ${(isActive && toDate && !isNavigating) || (isPending && navigation.location?.search.includes('?toDate')) ? 'active' : ''}`
                }
                to={{
                    pathname: routePaths.events.path,
                    search: `toDate=${today}`,
                }}
                viewTransition
            >
                history
            </NavLink>
        </div>
    );
}
