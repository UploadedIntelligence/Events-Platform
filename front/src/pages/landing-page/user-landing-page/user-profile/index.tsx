import { Card, Button, CardContent, Typography, Snackbar, Alert } from '@mui/material';
import authClient from '../../../../services/auth-client.ts';
import { Navigate, NavLink } from 'react-router-dom';
import { useState } from 'react';
import * as React from 'react';
import { RoleApplication } from '../../../../components/role-application.tsx';

export function UserProfile() {
    const { data } = authClient.useSession();
    const [applicationStatus, setApplicationStatus] = useState<'Idle' | 'Loading' | 'Success' | 'Error'>('Idle');
    const [openAlert, setOpenAlert] = useState<boolean>(false);

    const handleClose = (event: React.SyntheticEvent | Event) => {
        if (event?.type === 'click') return;
        setOpenAlert(false);
    };

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
                                <RoleApplication
                                    setApplicationStatus={setApplicationStatus}
                                    setOpenAlert={setOpenAlert}
                                />
                            )}
                            <Button>History</Button>
                            <Button>Delete account</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Navigate to="/" />
            )}
            <Snackbar autoHideDuration={5000} open={openAlert} onClose={handleClose} sx={{ position: 'inherit' }}>
                <Alert
                    variant="filled"
                    severity={applicationStatus === 'Success' ? 'success' : 'error'}
                    sx={{ width: '100%' }}
                >
                    {applicationStatus === 'Success' ? 'Application sent' : 'Application pending'}
                </Alert>
            </Snackbar>
        </div>
    );
}
