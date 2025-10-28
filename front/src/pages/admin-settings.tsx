import authClient from '../services/auth-client.ts';
import {
    Card,
    Button,
    Typography,
    CardActions,
    TableContainer,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
} from '@mui/material';
import axios from '../config/client.ts';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface Application {
    userEmail: string;
    status: 'pending' | 'approved' | 'rejected';
}

export function AdminSettings() {
    const [applications, setApplications] = useState<Array<Application> | null>(null);

    async function applicationResponse(applicant_email: string, response: 'approved' | 'rejected'): Promise<void> {
        await axios.put('/application-response', { applicant_email, response }, { withCredentials: true });
    }

    async function fetchApplications(): Promise<void> {
        const applications_response: Array<Application> = (await axios.get('/applications', { withCredentials: true }))
            .data;
        console.log(applications_response);
        setApplications(applications_response);
    }

    const { data } = authClient.useSession();
    return (
        <div>
            {data?.user?.role === 'admin' ? (
                <Card>
                    <NavLink to="/user-profile">
                        <Button>Go Back</Button>
                    </NavLink>

                    <CardActions style={{ display: 'grid' }}>
                        <Button
                            onClick={() => {
                                fetchApplications();
                            }}
                        >
                            View Applications
                        </Button>
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
                                                        <Button
                                                            onClick={() =>
                                                                applicationResponse(application.userEmail, 'approved')
                                                            }
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            sx={{ marginLeft: '8px' }}
                                                            color="secondary"
                                                            onClick={() =>
                                                                applicationResponse(application.userEmail, 'rejected')
                                                            }
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
                    </CardActions>
                </Card>
            ) : null}
        </div>
    );
}
