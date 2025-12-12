import { Button, Typography, TableContainer, Table, TableHead, TableCell, TableRow, TableBody } from '@mui/material';
import { type Application } from '../pages/landing-page/user-landing-page/user-profile/admin-settings';
import axios from '../config/client.ts';
import type { Role } from '../utilities/types.ts';
import { useMutation } from '@tanstack/react-query';
import QueryClient from '../services/tanstack-query-client.ts';

export function ApplicationTable({ applications }: { applications: Array<Application> | undefined }) {
    // async function applicationResponse(
    //     applicant_email: string,
    //     response: 'approved' | 'rejected',
    //     role: Role,
    // ): Promise<void> {
    //     await axios.put('/application-response', { applicant_email, response, role });
    // }
    const { mutate } = useMutation({
        mutationFn: (variables: { applicant_email: string; response: 'approved' | 'rejected'; role: Role }) => {
            return axios.put('/application-response', {
                applicant_email: variables.applicant_email,
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
                                            onClick={() =>
                                                mutate({
                                                    applicant_email: application.userEmail,
                                                    response: 'approved',
                                                    role: application.role,
                                                })
                                            }
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            sx={{ marginLeft: '8px' }}
                                            color="secondary"
                                            onClick={() =>
                                                mutate({
                                                    applicant_email: application.userEmail,
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
