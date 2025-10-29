import authClient from '../../../../services/auth-client.ts';
import { Card, Button, CardActions } from '@mui/material';
import { NavLink, Route, Routes } from 'react-router-dom';
import { ApplicationTable } from '../../../../components/application-table.tsx';
import { useState } from 'react';

export interface Application {
    userEmail: string;
    status: 'pending' | 'approved' | 'rejected';
}

export function AdminSettings() {
    const { data } = authClient.useSession();
    const [applicationsVisible, setApplicationsVisible] = useState<boolean>(false);

    if (data?.user?.role !== 'admin') {
        return <div>Forbidden</div>;
    }

    return (
        <div>
            <Card>
                <NavLink to="/user-profile">
                    <Button>Go Back</Button>
                </NavLink>

                <CardActions style={{ display: 'grid' }}>
                    <NavLink to={applicationsVisible ? '/admin-settings' : '/admin-settings/view-applications'}>
                        <Button onClick={() => setApplicationsVisible(!applicationsVisible)}>
                            {applicationsVisible ? 'Hide ' : 'View '}Applications
                        </Button>
                    </NavLink>
                </CardActions>
            </Card>
            <Routes>
                <Route path="/view-applications" element={<ApplicationTable />} />
            </Routes>
        </div>
    );
}
