import type { IUserEvents } from '../pages/landing-page/user-landing-page/user-events.tsx';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

export function EventList({ events }: { events: Array<IUserEvents> | [] }) {
    return events.map((event, index) => {
        const formatDate = (date: string) => {
            return new Date(date).toLocaleString('en-GB');
        };
        return (
            <Card key={index} variant="outlined" sx={{ border: '1px solid grey', marginBottom: '8px' }}>
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
                        {event.actions?.map((action, index) => {
                            return (
                                <Button
                                    key={index}
                                    color={action?.type === '/attending' ? 'secondary' : 'primary'}
                                    size="small"
                                    onClick={() => action?.action()}
                                >
                                    {action?.title}
                                </Button>
                            );
                        })}
                    </CardActions>
                </CardContent>
            </Card>
        );
    });
}
