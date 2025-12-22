import '../styles/nav-bar.scss';
import { Button, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useState, type MouseEvent } from 'react';
import authClient from '../services/auth-client.ts';

export function NavBar() {
    const { data } = authClient.useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function logOut() {
        authClient.signOut();
    }
    return (
        <AppBar className="NavBar-main" position="static">
            <Toolbar variant="dense" sx={{ display: 'inline', minHeight: 0, justifyItems: 'flex' }}>
                <div className="NavBar-content">
                    {data?.user?.role !== 'user' && (
                        <Button component={NavLink} to="/create-event" className="NavBar-option" variant="outlined">
                            create event
                        </Button>
                    )}
                    <Button component={NavLink} to="/upcoming-events" className="NavBar-option" variant="outlined">
                        upcoming events
                    </Button>
                    <Button component={NavLink} to="/past-events" className="NavBar-option" variant="outlined">
                        past events
                    </Button>
                    <Button component={NavLink} to="/attending" className="NavBar-option" variant="outlined">
                        attending
                    </Button>

                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="outlined"
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
                        <MenuItem component={NavLink} to="/user-profile">
                            Profile
                        </MenuItem>
                        <MenuItem onClick={logOut}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}
