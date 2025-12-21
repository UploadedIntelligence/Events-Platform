import '../../../../App.css';
import { Card, Button, CardContent, Typography } from '@mui/material';
import { Navigate, NavLink } from 'react-router-dom';
import { RoleApplication } from '../../../../components/role-application.tsx';
import { DeleteAccount } from '../../../../components/delete-account-dialog.tsx';
import { getSession } from '../../../../utilities/user-permissions.ts';
import { StyledPaper } from '../../../../mui-styled-components';

export function UserProfile() {
    const user = getSession();
    return (
        <StyledPaper>
            {user ? (
                <Card>
                    <CardContent>
                        <Typography>Hello, {user.name}</Typography>
                        <div style={{ display: 'grid' }}>
                            {user.role === 'admin' && (
                                <Button component={NavLink} to="/admin-settings" className="UserProfile-option">
                                    Admin settings
                                </Button>
                            )}
                            <Button component={NavLink} to="/user-settings" className="UserProfile-option">
                                User settings
                            </Button>
                            {user.role === 'user' && <RoleApplication />}
                            <Button component={NavLink} to="/user-history" className="UserProfile-option">
                                History
                            </Button>
                            <DeleteAccount />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Navigate to="/" />
            )}
        </StyledPaper>
    );
}
