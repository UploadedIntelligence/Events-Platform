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
} from '@mui/material';
import axios from '../config/client.ts';
import authClient from '../services/auth-client.ts';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

export function UserSettings() {
    const { data } = authClient.useSession();
    const [adminSettings, setAdminSettings] = useState<boolean>(false);
    const [viewApplications, setViewApplications] = useState<boolean>(false);
    const [applications, setApplications] = useState<any>(null);

    async function applyStaff() {
        await axios.get('/apply-staff', { withCredentials: true });
    }

    async function fetchApplications(): void {
        const applications_response = (await axios.get('/applications', { withCredentials: true })).data;
        console.log(applications_response);
        setApplications(applications_response);
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
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ padding: 0 }}>
                                                    {applications ? (
                                                        applications.map((application: any, idx: number) => {
                                                            return (
                                                                <a key={idx}>
                                                                    <Button>{application.email}</Button>
                                                                </a>
                                                            );
                                                        })
                                                    ) : (
                                                        <DialogContentText>No providers found</DialogContentText>
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ padding: 0, verticalAlign: 'top' }}>
                                                    {applications
                                                        ? applications.map((application, idx) => {
                                                              return (
                                                                  <a key={idx}>
                                                                      {application.status}
                                                                  </a>
                                                              );
                                                          })
                                                        : []}
                                                </TableCell>
                                            </TableRow>
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
                            <CardActions style={{ display: 'grid' }}>
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
                            </CardActions>
                        </CardContent>
                    </Card>
                )
            ) : (
                <Navigate to="/" />
            )}
        </div>
    );
}
