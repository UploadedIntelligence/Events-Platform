import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { type Application } from '../pages/user-landing-page/user-profile/admin-settings/admin-settings.route.tsx';
import axios from '../config/client.ts';
import type { Role } from '../utilities/types.ts';
import { useMutation } from '@tanstack/react-query';
import QueryClient from '../services/tanstack-query-client.ts';

export function ApplicationTable({ applications }: { applications: Array<Application> | undefined }) {
    const { mutate } = useMutation({
        mutationFn: (variables: { applicantEmail: string; response: 'approved' | 'rejected'; role: Role }) => {
            return axios.put('/application-response', {
                applicantEmail: variables.applicantEmail,
                response: variables.response,
                role: variables.role,
            });
        },
        onSuccess: async () => {
            await QueryClient.invalidateQueries({
                queryKey: ['applications'],
            });
        },
    });

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
                                            color="success"
                                            onClick={() =>
                                                mutate({
                                                    applicantEmail: application.userEmail,
                                                    response: 'approved',
                                                    role: application.role,
                                                })
                                            }
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            sx={{ marginLeft: '8px' }}
                                            color="error"
                                            onClick={() =>
                                                mutate({
                                                    applicantEmail: application.userEmail,
                                                    response: 'rejected',
                                                    role: application.role,
                                                })
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
