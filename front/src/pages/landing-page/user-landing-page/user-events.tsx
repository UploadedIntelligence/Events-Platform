import { useQuery } from '@tanstack/react-query';
import axios from '../../../config/client.ts';
import { Spinner } from '../../../components/spinner/spinner.tsx';
import { EventCard } from '../../../components/event-card/event-card.tsx';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { EpEventGrid } from '../../../components/event-grid/event-grid.tsx';
import { EpToggle } from '../../../components/toggle/toggle.tsx';
import { EpNavLink } from '../../../components/nav-link/nav-link.tsx';
import { EpEventContainer } from '../../../components/event-container/event-container.tsx';

export interface IUserEvents {
    id: string;
    name: string;
    location: string;
    description: string;
    start: string;
    end: string;
    imgUrl?: string;
    actions?: Array<{
        title: string;
        type: string;
        action: () => void;
    }> | null;
}

export function UserEvents({ eventUrl }: { eventUrl: string }) {
    const { data, isPending, error } = useQuery({
            queryKey: [eventUrl],
            queryFn: () => {
                return axios.get<Array<IUserEvents>>(eventUrl);
            },
        }),
        events =
            data?.data.map((event) => {
                return {
                    id: event.id,
                    name: event.name,
                    location: event.location,
                    description: event.description,
                    start: event.start,
                    end: event.end,
                    imgUrl: event.imgUrl,
                };
            }) ?? [];

    if (isPending) {
        return <Spinner />;
    }

    if (error) {
        console.log(error);
    }

    return (
        <EpEventContainer>
            <EpToggle>
                <EpNavLink variant="secondary" to="/discover/past-events">
                    Past
                </EpNavLink>
                <EpNavLink variant="secondary" to="/discover/upcoming-events">
                    Upcoming
                </EpNavLink>
            </EpToggle>
            <EpEventGrid>
                {eventUrl === '/user-history' ? (
                    <Button component={NavLink} to="/user-profile" variant="outlined" style={{ margin: '0.5em' }}>
                        Go Back
                    </Button>
                ) : null}
                <EventCard events={events} />
            </EpEventGrid>
        </EpEventContainer>
    );
}
