import { useQuery } from '@tanstack/react-query';
import axios from '../../../config/client.ts';
import { Spinner } from '../../../components/loading.tsx';
import { EventList } from '../../../components/event-list.tsx';
import { AttendOrCancelEventDialog } from '../../../components/attend-event-dialog.tsx';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';

export interface IUserEvents {
    id: string;
    name: string;
    location: string;
    description: string;
    start: string;
    end: string;
    actions?: Array<{
        title: string;
        type: string;
        action: () => void;
    }> | null;
}

export function UserEvents({ eventUrl }: { eventUrl: string }) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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
                    actions:
                        eventUrl !== '/past-events' && eventUrl !== '/user-history'
                            ? [
                                  {
                                      title: eventUrl === '/attending' ? 'Cancel attendance' : 'Attend',
                                      type: eventUrl,
                                      action: () => {
                                          setSelectedEventId(event.id);
                                          setDialogOpen(true);
                                      },
                                  },
                              ]
                            : null,
                };
            }) ?? [];

    if (isPending) {
        return <Spinner />;
    }

    if (error) {
        console.log(error);
    }

    return (
        <div>
            {eventUrl === '/user-history' ? (
                <NavLink to="/user-profile">
                    <Button style={{ margin: '0.5em' }}>Go Back</Button>
                </NavLink>
            ) : null}
            <EventList events={events} />
            <AttendOrCancelEventDialog
                dialogOpen={dialogOpen}
                selectedEventId={selectedEventId}
                isAttending={eventUrl === '/attending'}
                setDialogOpen={setDialogOpen}
            />
        </div>
    );
}
