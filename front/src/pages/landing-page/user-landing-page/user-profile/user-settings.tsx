import authClient from '../../../../services/auth-client.ts';
import { Card, Button, CardActions } from '@mui/material';
import { NavLink } from 'react-router-dom';

export function UserSettings() {
    const { data } = authClient.useSession();

    return data?.user?.role !== 'user' ? (
        <Card>
            <NavLink to="/user-profile">
                <Button>Go Back</Button>
            </NavLink>
            <CardActions></CardActions>
        </Card>
    ) : null;
}
