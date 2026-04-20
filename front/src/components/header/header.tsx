import './header.scss';
import { EpButton } from '../button/button.tsx';
import { type MouseEvent, type ReactNode, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import authClient from '../../services/auth-client.ts';
import { SearchBar } from '../search-bar/search-bar.tsx';
import { EpProfileImage } from '../profile-image/profile-image.tsx';
import { EpHeaderNavLink } from '../header-navlink/header-navlink.tsx';
import dayjs from 'dayjs';
import { routePaths } from '../../routes.ts';

export function Header({ children }: { children: ReactNode }) {
    const today = dayjs().format('YYYY-MM-DD-HH');
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
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigate(routePaths.login.path);
                },
            },
        });
    }

    return (
        <div className="EpHeader">
            <div className="EpHeader-dashboardButton">{children}</div>
            <div className="EpHeader-option">
                <EpHeaderNavLink to={{ pathname: routePaths.events.path, search: `fromDate=${today}` }}>
                    Events
                </EpHeaderNavLink>
                <EpHeaderNavLink to="manage-events">Manage Events</EpHeaderNavLink>
                <EpHeaderNavLink to="calendar">Calendar</EpHeaderNavLink>
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
        </div>
    );
}
