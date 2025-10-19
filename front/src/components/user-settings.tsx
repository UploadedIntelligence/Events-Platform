import {
    Card,
    Button,
    CardContent,
    Typography,
    CardActions,
    TableContainer,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    DialogContentText,
} from '@mui/material';
import axios from '../config/client.ts';
import authClient from '../services/auth-client.ts';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

export function UserSettings() {
    const { data } = authClient.useSession();
    const [adminSettings, setAdminSettings] = useState<boolean>(false);
    const [viewApplications, setViewApplications] = useState<boolean>(false);
    const [applications, setApplications] = useState<Array<any> | null>(null);

    async function applyStaff() {
        await axios.get('/apply-staff', { withCredentials: true });
    }

    async function fetchApplications(): Promise<void> {
        const applications_response = (await axios.get('/applications', { withCredentials: true })).data;
        console.log(applications_response);
        setApplications(applications_response);
    }

    async function applicationResponse(applicant_email: string, response: string): Promise<void> {
        await axios.put('/application-response', { applicant_email, response }, { withCredentials: true });
    }

    return (
        <div>
            {data ? (
                adminSettings ? (
                    <Card>
                        <Button onClick={() => setAdminSettings(false)}>Go Back</Button>
                        <CardActions style={{ display: 'grid' }}>
                            <Button
                                onClick={() => {
                                    fetchApplications();
                                    setViewApplications(!viewApplications);
                                }}
                            >
                                View Applications
                            </Button>
                            {viewApplications && (
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
                                            {applications ? (
                                                applications.map((application: any, idx: number) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell>
                                                                <Typography key={idx}>
                                                                    {application.userEmail}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography key={idx}>{application.status}</Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ justifySelf: 'flex-end' }} align="center">
                                                                <Button
                                                                    key={idx}
                                                                    onClick={() =>
                                                                        applicationResponse(
                                                                            application.userEmail,
                                                                            'approved',
                                                                        )
                                                                    }
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    key={idx}
                                                                    sx={{ marginLeft: '8px' }}
                                                                    color="secondary"
                                                                    onClick={() =>
                                                                        applicationResponse(
                                                                            application.userEmail,
                                                                            'rejected',
                                                                        )
                                                                    }
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            ) : (
                                                <DialogContentText>No providers found</DialogContentText>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardActions>
                    </Card>
                ) : (
                    <Card>
                        <CardContent>
                            <Typography>Hello, {data?.user.name}</Typography>
                            <div style={{ display: 'grid' }}>
                                {data?.user.role === 'admin' && (
                                    <Button onClick={() => setAdminSettings(true)}>Admin settings</Button>
                                )}
                                <Button>User settings</Button>
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
                )
            ) : (
                <Navigate to="/" />
            )}
        </div>
    );
}
