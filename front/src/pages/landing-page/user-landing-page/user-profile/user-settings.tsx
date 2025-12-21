import { Button, CardActions } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { getSession } from '../../../../utilities/user-permissions.ts';
import { StyledPaper } from '../../../../mui-styled-components';

export function UserSettings() {
    const user = getSession();

    return user?.role !== 'user' ? (
        <StyledPaper>
            <NavLink to="/user-profile">
                <Button>Go Back</Button>
            </NavLink>
            <CardActions></CardActions>
        </StyledPaper>
    ) : null;
}
