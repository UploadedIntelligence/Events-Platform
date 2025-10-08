import axios from '../config/client.ts';
import '../styles/nav-bar.scss';
import { Button, CardActions, CardContent, Typography, AppBar, Toolbar } from '@mui/material';
import authClient from '../services/auth-client.ts';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function NavBar() {
    const navigate = useNavigate();
    const { data } = authClient.useSession();
    const [events, setEvents] = useState<Array<any>>([]);
    const [visibleEvents, setVisibleEvents] = useState<boolean>(false);

    // check if user is staff/admin to create events

    async function logOut() {
        authClient.signOut();
    }

    async function fetchEvents(pastOrFuture: 'past' | 'future') {
        let events;
        if (pastOrFuture === 'future') {
            events = await axios.get('/upcoming-events');
        } else {
            events = await axios.get('/past-events');
        }
        setVisibleEvents(true);
        setEvents(events.data);
    }

    return (
        <div>
            {data ? (
                <AppBar className="NavBar-main" position="static">
                    <Toolbar variant="dense" sx={{ display: 'inline', minHeight: 0 }}>
                        <div className="NavBar-content">
                            <Button
                                onClick={() => {
                                    setVisibleEvents(false);
                                    navigate('/create-event');
                                }}
                            >
                                Create an event
                            </Button>
                            <Button
                                onClick={() => {
                                    fetchEvents('future');
                                    navigate('/');
                                }}
                            >
                                Upcoming Events
                            </Button>
                            <Button
                                onClick={() => {
                                    fetchEvents('past');
                                }}
                            >
                                Past Events
                            </Button>
                            <Button onClick={logOut}>log out</Button>
                        </div>
                    </Toolbar>
                </AppBar>
            ) : (
                <Navigate to="/user/login" />
            )}
            <div hidden={!visibleEvents}>
                {events.map((event) => {
                    const start = event.start.slice(0, 16).replace('T', ' at ');
                    const end = event.end.slice(0, 16).replace('T', ' at ');
                    return (
                        <div>
                            <CardContent sx={{ border: '3px solid #00802778', marginBottom: '8px' }}>
                                <Typography variant="h5" component="div">
                                    {event.name}
                                </Typography>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {event.location}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>start: {start}</Typography>
                                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>end: {end}</Typography>
                                <Typography variant="body2">{event.description}</Typography>
                                <CardActions>
                                    <Typography>Free event</Typography>
                                    <Button size="small" variant='contained'>Attend</Button>
                                </CardActions>
                            </CardContent>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
