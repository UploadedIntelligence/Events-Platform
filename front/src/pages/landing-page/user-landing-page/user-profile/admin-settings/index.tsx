import authClient from '../../../../../services/auth-client.ts';
import { Card, Button, CardActions } from '@mui/material';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import type { Role } from '../../../../../utilities/types.ts';
import { ViewApplications } from './view-applications.tsx';

export interface Application {
    userEmail: string;
    status: 'pending' | 'approved' | 'rejected';
    role: Role;
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
                    <Button
                        component={NavLink}
                        to={applicationsVisible ? '/admin-settings' : '/admin-settings/view-applications'}
                        onClick={() => setApplicationsVisible(!applicationsVisible)}
                    >
                        {applicationsVisible ? 'Hide ' : 'View '}Applications
                    </Button>
                </CardActions>
            </Card>
            <Routes>
                <Route path="/view-applications" element={<ViewApplications />} />
            </Routes>
        </div>
    );
}
