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
                        <NavLink to="/create-event">
                            <Button>Create an event</Button>
                        </NavLink>
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
                        <MenuItem>
                            <NavLink to="/user-profile" style={{ color: 'inherit' }}>
                                Profile
                            </NavLink>
                        </MenuItem>
                        <MenuItem onClick={logOut}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}
