import { Card, Button, CardActions } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { getSession } from '../../../../utilities/user-permissions.ts';

export function UserSettings() {
    const user = getSession();

    return user?.role !== 'user' ? (
        <Card>
            <NavLink to="/user-profile">
                <Button>Go Back</Button>
            </NavLink>
            <CardActions></CardActions>
        </Card>
    ) : null;
}
