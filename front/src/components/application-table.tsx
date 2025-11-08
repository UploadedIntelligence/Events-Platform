import { Button, Typography, TableContainer, Table, TableHead, TableCell, TableRow, TableBody } from '@mui/material';
import { type Application } from '../pages/landing-page/user-landing-page/user-profile/admin-settings.tsx';
import axios from '../config/client.ts';
import { useEffect, useState } from 'react';
import authClient from '../services/auth-client.ts';
import { Spinner } from './loading.tsx';

export function ApplicationTable() {
    const { data } = authClient.useSession();
    const [applications, setApplications] = useState<Array<Application> | null>(null);
    const [isLoading, setIsLoading] = useState<'Loading' | 'Success' | 'Error'>('Loading');

    if (data?.user?.role !== 'admin') {
        return <div>Forbidden</div>;
    }

    useEffect(() => {
        fetchApplications();
    }, []);

    if (isLoading === 'Loading') {
        return <Spinner />;
    } else if (isLoading === 'Error') {
        return <>Something went wrong</>;
    }

    async function fetchApplications(): Promise<void> {
        setIsLoading('Loading');
        const applications_response: { status: number; data: Array<Application> } = await axios.get('/applications', {
            withCredentials: true,
        });
        if (applications_response.status === 200) {
            setIsLoading('Success');
        } else {
            setIsLoading('Error');
        }

        setApplications(applications_response.data);
    }

    async function applicationResponse(applicant_email: string, response: 'approved' | 'rejected'): Promise<void> {
        await axios.put('/application-response', { applicant_email, response }, { withCredentials: true });
        await fetchApplications();
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User: </TableCell>
                        <TableCell>Status: </TableCell>
                        <TableCell align="center">Approve/Reject</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {applications &&
                        applications.map((application: Application, idx: number) => {
                            return (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <Typography>{application.userEmail}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{application.status}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ justifySelf: 'flex-end' }} align="center">
                                        <Button onClick={() => applicationResponse(application.userEmail, 'approved')}>
                                            Approve
                                        </Button>
                                        <Button
                                            sx={{ marginLeft: '8px' }}
                                            color="secondary"
                                            onClick={() => applicationResponse(application.userEmail, 'rejected')}
                                        >
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
