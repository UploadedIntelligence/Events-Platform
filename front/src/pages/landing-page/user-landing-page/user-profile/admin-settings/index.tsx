import { Card, Button, CardActions } from '@mui/material';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import type { Role } from '../../../../../utilities/types.ts';
import { ViewApplications } from './view-applications.tsx';
import { getSession } from '../../../../../utilities/user-permissions.ts';
import { StyledPaper } from '../../../../../mui-styled-components';

export interface Application {
    userEmail: string;
    status: 'pending' | 'approved' | 'rejected';
    role: Role;
}

export function AdminSettings() {
    const user = getSession();
    const [applicationsVisible, setApplicationsVisible] = useState<boolean>(false);

    if (user?.role !== 'admin') {
        return <div>Forbidden</div>;
    }

    return (
        <StyledPaper>
            <Card>
                <NavLink to="/user-profile">
                    <Button variant="outlined" sx={{ margin: '0.5em' }}>
                        Go Back
                    </Button>
                </NavLink>

                <CardActions style={{ display: 'grid' }}>
                    <Button
                        component={NavLink}
                        to={applicationsVisible ? '/admin-settings' : '/admin-settings/view-applications'}
                        onClick={() => setApplicationsVisible(!applicationsVisible)}
                        variant="outlined"
                    >
                        {applicationsVisible ? 'Hide ' : 'View '}Applications
                    </Button>
                </CardActions>
            </Card>
            <Routes>
                <Route path="/view-applications" element={<ViewApplications />} />
            </Routes>
        </StyledPaper>
    );
}
