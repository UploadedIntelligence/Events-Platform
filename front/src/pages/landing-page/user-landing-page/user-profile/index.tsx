import { Card, Button, CardContent, Typography } from '@mui/material';
import axios from '../../../../config/client.ts';
import authClient from '../../../../services/auth-client.ts';
import { Navigate, NavLink } from 'react-router-dom';

export function UserProfile() {
    const { data } = authClient.useSession();

    async function applyStaff() {
        await axios.get('/apply-staff', { withCredentials: true });
    }

    return (
        <div>
            {data ? (
                <Card>
                    <CardContent>
                        <Typography>Hello, {data?.user.name}</Typography>
                        <div style={{ display: 'grid' }}>
                            {data?.user.role === 'admin' && (
                                <NavLink to="/admin-settings">
                                    <Button>Admin settings</Button>
                                </NavLink>
                            )}
                            <NavLink to="/user-settings">
                                <Button>User settings</Button>
                            </NavLink>
                            {data?.user.role === 'user' && (
                                <Button onClick={applyStaff} disabled={data.user.staffApplication}>
                                    Become staff member
                                </Button>
                            )}
                            <Button>History</Button>
                            <Button>Delete account</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Navigate to="/" />
            )}
        </div>
    );
}
