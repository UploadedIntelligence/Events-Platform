import { useQuery } from '@tanstack/react-query';
import axios from '../config/client.ts';
import { Card, CardContent, Typography, CardActions, Button, Dialog } from '@mui/material';
import { Spinner } from './loading.tsx';

interface IEventDetails {
    id: number;
    name: string;
    location: string;
    description: string;
    start: string;
    end: string;
    imgUrl: string | null;
}

export function FetchEvents({ event_type }: { event_type: string }) {
    const { data, isPending, error } = useQuery({
            queryKey: [event_type],
            queryFn: () => {
                return axios.get<Array<IEventDetails>>(event_type, { withCredentials: true });
            },
        }),
        events = data?.data;
    console.log(events);
    if (isPending) {
        return <Spinner />;
    }

    if (error) {
        console.log(error);
    }

    function showDialog() {
        return;
    }

    return (
        <div>
            {events!.map((event) => {
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
                                {(event_type === '/upcoming-events' || event_type === '/attending') && (
                                    <Button
                                        color={event_type === '/attending' ? 'secondary' : 'primary'}
                                        size="small"
                                        onClick={() => showDialog()}
                                    >
                                        {event_type === '/upcoming-events' ? 'Attend' : 'Cancel Attendance'}
                                    </Button>
                                )}
                            </CardActions>
                        </CardContent>
                    </Card>
                );
            })}
            <Dialog open={false}>Hi</Dialog>
        </div>
    );
}
