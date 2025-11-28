import { Card, Button, CardContent, Typography} from '@mui/material';
import authClient from '../../../../services/auth-client.ts';
import { Navigate, NavLink } from 'react-router-dom';
import { RoleApplication } from '../../../../components/role-application.tsx';
import { DeleteAccount } from "../../../../components/delete-account-dialog.tsx";

export function UserProfile() {
    const { data } = authClient.useSession();
    return (
        <div>
            {data ? (
                <Card>
                    <CardContent>
                        <Typography>
                            Hello, {data.user.name}
                        </Typography>
                        <div style={{ display: 'grid' }}>
                            {data.user.role === 'admin' && (
                                <NavLink to="/admin-settings">
                                    <Button>Admin settings</Button>
                                </NavLink>
                            )}
                            <NavLink to="/user-settings">
                                <Button>User settings</Button>
                            </NavLink>
                            {data.user.role === 'user' && (
                                <RoleApplication/>
                            )}
                            <NavLink to="/user-history">
                                <Button>History</Button>
                            </NavLink>
                            <DeleteAccount />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Navigate to="/" />
            )}
        </div>
    );
}
