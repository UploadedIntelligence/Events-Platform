import { useQuery } from '@tanstack/react-query';
import axios from '../../config/client.ts';
import { Spinner } from '../../components/spinner/spinner.tsx';
import { EventCard } from '../../components/event-card/event-card.tsx';
import { EventFilters } from '../../utilities/event-filters.ts';
import { EpEventGridContainer } from '../../components/event-grid-container/event-grid-container.tsx';
import { EpEventGrid } from '../../components/event-grid/event-grid.tsx';
import { EpEventGridToggle } from '../../components/event-grid-toggle/event-grid-toggle.tsx';
import dayjs from 'dayjs';
import { NavLink, useNavigation, useParams } from 'react-router-dom';
import './events.scss';

export interface IEvents {
    id: string;
    organiserId: string;
    name: string;
    location: string;
    description: string;
    start: string;
    end: string;
    imgUrl?: string;
    actions?: {
        title: string;
        type: string;
        action: () => void;
    };
}

export interface IAttendeeInfo {
    id: string;
    userId: string;
    email: string;
}

export function Events() {
    const { userId } = useParams();
    const today = dayjs().format('YYYY-MM-DD-HH');
    const { fromDate, toDate } = EventFilters();
    const navigation = useNavigation();
    const isNavigating = Boolean(navigation.location);

    const { data, isPending, error } = useQuery({
            queryKey: ['events', fromDate, toDate, userId],
            queryFn: () => {
                const hasFromDate = dayjs(fromDate, 'YYYY-MM-DD-HH');
                const hasToDate = dayjs(toDate, 'YYYY-MM-DD-HH');
                return axios.get<Array<IEvents & { attendees: Array<IAttendeeInfo> }>>(
                    `${userId ? `/users/${userId}/events` : '/events'}`,
                    {
                        params: {
                            fromDate: hasFromDate.isValid() && hasFromDate.toISOString(),
                            toDate: hasToDate.isValid() && hasToDate.toISOString(),
                        },
                    },
                );
            },
        }),
        events: Array<IEvents> =
            data?.data.map((event) => {
                return {
                    id: event.id,
                    organiserId: event.organiserId,
                    name: event.name,
                    location: event.location,
                    description: event.description,
                    start: event.start,
                    end: event.end,
                    imgUrl: event.imgUrl,
                };
            }) ?? [];

    if (!navigation.location?.pathname.includes('events') && navigation.state === 'loading') {
        return <Spinner />;
    }

    if (error) {
        console.log(error);
    }

    return (
        <EpEventGridContainer>
            {!userId && (
                <EpEventGridToggle>
                    <NavLink
                        className={({ isActive, isPending }) =>
                            `EpEventGridNavLink ${(isActive && toDate && !isNavigating) || (isPending && navigation.location?.search.includes('?toDate')) ? 'active' : ''}`
                        }
                        to={{
                            search: `toDate=${today}`,
                        }}
                    >
                        past
                    </NavLink>
                    <NavLink
                        className={({ isActive, isPending }) =>
                            `EpEventGridNavLink ${(isActive && fromDate && !isNavigating) || (isPending && navigation.location?.search.includes('?fromDate')) ? 'active' : ''}`
                        }
                        to={{
                            search: `fromDate=${today}`,
                        }}
                    >
                        upcoming
                    </NavLink>
                </EpEventGridToggle>
            )}
            {isPending || navigation.state === 'loading' ? (
                <Spinner />
            ) : (
                <EpEventGrid>
                    {/*{searchParams!.get('eventType') === 'history' ? (*/}
                    {/*    <Button component={NavLink} to="/user-profile" variant="outlined" style={{ margin: '0.5em' }}>*/}
                    {/*        Go Back*/}
                    {/*    </Button>*/}
                    {/*) : null}*/}
                    <EventCard events={events} />
                </EpEventGrid>
            )}
        </EpEventGridContainer>
    );
}
