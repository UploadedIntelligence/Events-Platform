import '../styles/nav-bar.scss';
import { Button, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import authClient from '../services/auth-client.ts';
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useState, type MouseEvent } from 'react';
import { FetchEvents } from './fetch-events.tsx';
import { CreateEventPage } from '../pages/create-event.tsx';
import { UserSettings } from './user-settings.tsx';

export function UserLandingPage() {
    const navigate = useNavigate();
    const { data } = authClient.useSession();
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

    return (
        <div>
            {data ? (
                <AppBar className="NavBar-main" position="static">
                    <Toolbar variant="dense" sx={{ display: 'inline', minHeight: 0 }}>
                        <div className="NavBar-content">
                            {data.user?.role !== 'user' && (
                                <Button
                                    onClick={() => {
                                        navigate('/create-event');
                                    }}
                                >
                                    Create an event
                                </Button>
                            )}
                            <NavLink to="/upcoming-events">
                                <Button>upcoming events</Button>
                            </NavLink>
                            <NavLink to="/past-events">
                                <Button>past events</Button>
                            </NavLink>
                            <NavLink to="/attending">
                                <Button>attending</Button>
                            </NavLink>

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
                <Navigate to="/login" />
            )}
            <Routes>
                <Route path="/create-event" element={<CreateEventPage />} />
                <Route path="/upcoming-events" element={<FetchEvents event_type={'/upcoming-events'} />} />
                <Route path="/past-events" element={<FetchEvents event_type={'/past-events'} />} />
                <Route path="/attending" element={<FetchEvents event_type={'/attending'} />} />
                <Route path="/user-settings" element={<UserSettings />} />
            </Routes>
        </div>
    );
}
