import './header.scss';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { EpButton } from '../button/button.tsx';
import { getSession } from '../../utilities/user-permissions.ts';
import React, { type MouseEvent, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import authClient from '../../services/auth-client.ts';
import { SearchBar } from '../search-bar/search-bar.tsx';
import { EpNavLink } from '../nav-link/nav-link.tsx';
import { EpProfileImage } from "../profile-image/profile-image.tsx";

export function Header({
    isVisible,
    setIsVisible,
}: {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const user = getSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    async function logOut() {
        authClient.signOut();
    }

    function changeVisibility() {
        setIsVisible(!isVisible);
    }
    return (
        <div className="EpHeader">
            <div className="EpDashboardButton">
                <EpButton variant="ghost" onClick={changeVisibility}>
                    <EventAvailableIcon
                        sx={{
                            color: 'white',
                            background: '#0d7ff2',
                            borderRadius: '4px',
                            padding: '2px',
                            fontSize: '1.5em',
                        }}
                    />
                    Dashboard
                </EpButton>
            </div>
            {user ? (
                <div className="EpHeaderOptions">
                    {/*buttons need to be toggleable*/}
                    <EpNavLink to='/discover'>
                        Discover
                    </EpNavLink>
                    <EpNavLink to='/manage-events'>
                        Manage Events
                    </EpNavLink>
                    <EpNavLink to="/calendar">
                        Calendar
                    </EpNavLink>
                    <SearchBar />
                    <EpButton onClick={handleClick} variant="ghost">
                        <EpProfileImage />
                    </EpButton>
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
                            Settings
                        </MenuItem>
                        <MenuItem onClick={logOut}>Logout</MenuItem>
                    </Menu>
                </div>
            ) : (
                <div className="EpHeaderOptions">
                    <EpButton onClick={() => navigate('/login')}>Sign In</EpButton>
                    <EpButton onClick={() => navigate('/register')}>Sign Up</EpButton>
                </div>
            )}
        </div>
    );
}
