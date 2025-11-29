import { Card, Button, CardContent, Typography } from '@mui/material';
import { Navigate, NavLink } from 'react-router-dom';
import { RoleApplication } from '../../../../components/role-application.tsx';
import { DeleteAccount } from '../../../../components/delete-account-dialog.tsx';
import { getSession } from "../../../../utilities/user-permissions.ts";

export function UserProfile() {
    const user = getSession();
    return (
        <div>
            {user ? (
                <Card>
                    <CardContent>
                        <Typography>Hello, {user.name}</Typography>
                        <div style={{ display: 'grid' }}>
                            {user.role === 'admin' && (
                                <NavLink to="/admin-settings">
                                    <Button>Admin settings</Button>
                                </NavLink>
                            )}
                            <NavLink to="/user-settings">
                                <Button>User settings</Button>
                            </NavLink>
                            {user.role === 'user' && <RoleApplication />}
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
