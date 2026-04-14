import './header.scss';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { EpButton } from '../button/button.tsx';
import { getSession } from '../../utilities/user-permissions.ts';
import React, { type MouseEvent, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import authClient from '../../services/auth-client.ts';
import { SearchBar } from '../search-bar/search-bar.tsx';
import { EpProfileImage } from '../profile-image/profile-image.tsx';
import { EpHeaderNavLink } from '../header-navlink/header-navlink.tsx';
import dayjs from 'dayjs';

export function Header({
    isVisible,
    setIsVisible,
}: {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const user = getSession();
    const today = dayjs().format('YYYY-MM-DD-HH');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    if (!user) {
        setIsVisible(false);
    }

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
        if (user) {
            setIsVisible(!isVisible);
        }
    }
    return (
        <div className="EpHeader">
            <div className="EpHeader-dashboardButton">
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
                    {user ? 'Dashboard' : ''}
                </EpButton>
            </div>
            {user ? (
                <div className="EpHeader-option">
                    <EpHeaderNavLink to={{ pathname: '/events', search: `fromDate=${today}` }}>Events</EpHeaderNavLink>
                    <EpHeaderNavLink to="/manage-events">Manage Events</EpHeaderNavLink>
                    <EpHeaderNavLink to="/calendar">Calendar</EpHeaderNavLink>
                    <div className="EpHeader-option--positionRight">
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
                </div>
            ) : (
                <div className="EpHeader-option">
                    <EpHeaderNavLink to={{ pathname: '/events', search: `fromDate=${today}` }}>Events</EpHeaderNavLink>
                    <div className="EpHeader-option--positionRight">
                        <EpButton onClick={() => navigate('/login')}>Sign In</EpButton>
                        <EpButton onClick={() => navigate('/register')}>Sign Up</EpButton>
                    </div>
                </div>
            )}
        </div>
    );
}
