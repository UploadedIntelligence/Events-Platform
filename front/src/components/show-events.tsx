import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import * as React from 'react';

export function ShowEvents({
    visibleEvents,
    isUpcoming,
    isAttending,
    events,
    setDialogOpen,
    setSelectedEvent,
}: {
    visibleEvents: boolean;
    isUpcoming: boolean;
    isAttending: boolean;
    events: Array<any>;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedEvent: React.Dispatch<React.SetStateAction<any>>;
}) {
    async function showDialog(event: any) {
        setDialogOpen(true);
        setSelectedEvent(event);
    }

    console.log(events);

    if (!events.length) {
        return <div>No events</div>;
    }

    return (
        <div hidden={!visibleEvents}>
            {events.map((event) => {
                const formatDate = (date: string) => {
                    return new Date(date).toLocaleString('en-GB');
                };
                return (
                    <Card variant="outlined" sx={{ border: '1px solid grey', marginBottom: '8px' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {event.name}
                            </Typography>
                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                {event.location}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                start: {formatDate(event.start).replace(',', ' at ')}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                end: {formatDate(event.end).replace(',', ' at ')}
                            </Typography>
                            <Typography variant="body2">{event.description}</Typography>
                            <CardActions>
                                <Typography>Free event</Typography>
                                {(isUpcoming || isAttending) && (
                                    <Button
                                        color={isAttending ? 'secondary' : 'primary'}
                                        size="small"
                                        onClick={() => showDialog(event)}
                                    >
                                        {isUpcoming ? 'Attend' : 'Cancel Attendance'}
                                    </Button>
                                )}
                            </CardActions>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
