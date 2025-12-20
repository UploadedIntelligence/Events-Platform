import { Button, Dialog, DialogTitle, DialogActions, Alert } from '@mui/material';
import axios from '../config/client.ts';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import QueryClient from '../services/tanstack-query-client.ts';
import * as React from 'react';
import type { IUserEvents } from '../pages/landing-page/user-landing-page/user-events.tsx';

export function AttendOrCancelEventDialog({
    eventUrl,
    dialogOpen,
    selectedEventId,
    setDialogOpen,
}: {
    eventUrl: string;
    dialogOpen: boolean;
    selectedEventId: string | null;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [requestState, setRequestState] = useState<'Pending' | 'Error' | 'Success' | 'Idle'>('Idle');
    const isAttending: boolean = eventUrl === '/attending';
    const { mutate } = useMutation({
        mutationFn: () => {
            return axios.get<Array<IUserEvents>>(eventUrl);
        },
        onSuccess: async () => {
            await QueryClient.invalidateQueries({
                queryKey: [eventUrl],
            });
        },
    });

    async function attendOrCancelEvent() {
        setRequestState('Pending');
        const response = await axios.put('/attend-or-cancel', { event_id: selectedEventId, is_attending: isAttending });
        mutate();
        if (response.status === 200) {
            setRequestState('Success');
        } else {
            setRequestState('Error');
        }
    }

    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <div>
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                slotProps={{
                    transition: {
                        onExited: () => setRequestState('Idle'),
                    },
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                aria-hidden={false}
            >
                {requestState === 'Success' || requestState === 'Error' ? (
                    <Alert variant="filled" severity={requestState === 'Success' ? 'success' : 'error'}>
                        {requestState === 'Success'
                            ? `Attendance ${isAttending ? 'cancelled' : 'registered'} successfully`
                            : `Something went wrong`}
                    </Alert>
                ) : (
                    <>
                        <DialogTitle id="alert-dialog-title">
                            Confirm {isAttending ? 'cancellation' : 'attendance'}?
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={attendOrCancelEvent} color='success'>Yes</Button>
                            <Button onClick={handleClose} color='error'>No</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}
