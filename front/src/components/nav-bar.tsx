import axios from '../config/client.ts';
import '../styles/nav-bar.scss';
import { Button, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import authClient from '../services/auth-client.ts';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, type MouseEvent } from 'react';
import { AttendOrCancelEventDialog } from './attend-event-dialog.tsx';
import { ShowEvents } from './show-events.tsx';

export function NavBar() {
    const navigate = useNavigate();
    const { data } = authClient.useSession();
    const [events, setEvents] = useState<Array<any>>([]);
    const [visibleEvents, setVisibleEvents] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isUpcoming, setIsUpcoming] = useState<boolean>(false);
    const [isAttending, setIsAttending] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    console.log(data);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    //////////////////
    // check if user is staff/admin to create events

    async function logOut() {
        authClient.signOut();
    }

    async function fetchEvents(pastFutureOrAttending: 'past' | 'future' | 'attending') {
        let events;
        if (pastFutureOrAttending === 'future') {
            events = await axios.get('/upcoming-events', { withCredentials: true });
            setIsUpcoming(true);
            setIsAttending(false);
        } else if (pastFutureOrAttending === 'past') {
            events = await axios.get('/past-events', { withCredentials: true });
            setIsUpcoming(false);
            setIsAttending(false);
        } else {
            events = await axios.get('/attending', { withCredentials: true });
            setIsUpcoming(false);
            setIsAttending(true);
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
                            {data.user.role !== 'user' && (
                                <Button
                                    onClick={() => {
                                        setVisibleEvents(false);
                                        navigate('/create-event');
                                    }}
                                >
                                    Create an event
                                </Button>
                            )}
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
                                    navigate('/');
                                }}
                            >
                                Past Events
                            </Button>
                            <Button
                                onClick={() => {
                                    fetchEvents('attending');
                                    navigate('/');
                                }}
                            >
                                Attending
                            </Button>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                Dashboard
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                slotProps={{
                                    list: {
                                        'aria-labelledby': 'basic-button',
                                    },
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        navigate('/user-settings');
                                        setVisibleEvents(false);
                                    }}
                                >
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={logOut}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            ) : (
                <Navigate to="/user/login" />
            )}
            <ShowEvents
                visibleEvents={visibleEvents}
                events={events}
                setDialogOpen={setDialogOpen}
                setSelectedEvent={setSelectedEvent}
                isUpcoming={isUpcoming}
                isAttending={isAttending}
            />
            <AttendOrCancelEventDialog
                setEvents={setEvents}
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                selectedEvent={selectedEvent}
                isAttending={isAttending}
            />
        </div>
    );
}
