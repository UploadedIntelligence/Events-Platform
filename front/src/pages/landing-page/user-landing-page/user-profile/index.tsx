import '../../../../App.css';
import { Card, Button, CardContent, Typography, Paper } from '@mui/material';
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
                        <Paper sx={{ display: 'grid' }}>
                            {user.role === 'admin' && (
                                <Button
                                    component={NavLink}
                                    to="/admin-settings"
                                    className="UserProfile-option"
                                    variant="outlined"
                                >
                                    Admin settings
                                </Button>
                            )}
                            <Button
                                component={NavLink}
                                to="/user-settings"
                                className="UserProfile-option"
                                variant="outlined"
                            >
                                User settings
                            </Button>
                            {user.role === 'user' && <RoleApplication />}
                            <Button
                                component={NavLink}
                                to="/user-history"
                                className="UserProfile-option"
                                variant="outlined"
                            >
                                History
                            </Button>
                            <DeleteAccount />
                        </Paper>
                    </CardContent>
                </Card>
            ) : (
                <Navigate to="/" />
            )}
        </StyledPaper>
    );
}
