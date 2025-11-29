import { Button, Typography, TableContainer, Table, TableHead, TableCell, TableRow, TableBody } from '@mui/material';
import { type Application } from '../pages/landing-page/user-landing-page/user-profile/admin-settings';
import axios from '../config/client.ts';
import type { Role } from '../utilities/types.ts';
import * as React from 'react';

export function ApplicationTable({
    applications,
    setRefresh,
    refresh,
}: {
    applications: Array<Application> | undefined;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    refresh: boolean;
}) {
    async function applicationResponse(
        applicant_email: string,
        response: 'approved' | 'rejected',
        role: Role,
    ): Promise<void> {
        await axios.put('/application-response', { applicant_email, response, role });
        setRefresh(!refresh);
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User: </TableCell>
                        <TableCell>Status: </TableCell>
                        <TableCell>Role: </TableCell>
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
                                    <TableCell>
                                        <Typography>{application.role}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ justifySelf: 'flex-end' }} align="center">
                                        <Button
                                            onClick={() =>
                                                applicationResponse(application.userEmail, 'approved', application.role)
                                            }
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            sx={{ marginLeft: '8px' }}
                                            color="secondary"
                                            onClick={() =>
                                                applicationResponse(application.userEmail, 'rejected', application.role)
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
    );
}
