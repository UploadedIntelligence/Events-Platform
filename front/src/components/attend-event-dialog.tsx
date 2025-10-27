import { Button, Dialog, DialogTitle, DialogActions, Alert } from '@mui/material';
import axios from '../config/client.ts';
import { useState } from 'react';
import * as React from 'react';

export function AttendOrCancelEventDialog({
    dialogOpen,
    isAttending,
    selectedEventId,
    setDialogOpen,
}: {
    dialogOpen: boolean;
    isAttending: boolean;
    selectedEventId: number | null;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [requestState, setRequestState] = useState<'Pending' | 'Error' | 'Success' | 'Idle'>('Idle');

    async function attendOrCancelEvent() {
        setRequestState('Pending');
        const response = await axios.put(
            '/attend-or-cancel',
            { event_id: selectedEventId, is_attending: isAttending },
            { withCredentials: true },
        );
        if (response.status === 200) {
            setRequestState('Success');
        } else {
            setRequestState('Error');
        }
        setTimeout(() => window.location.reload(), 1000);
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
                {requestState === 'Success' ? (
                    <Alert variant="filled" severity="success">
                        Attendance {isAttending ? 'cancelled' : 'registered'} successfully
                    </Alert>
                ) : (
                    <>
                        <DialogTitle id="alert-dialog-title">
                            Confirm {isAttending ? 'cancellation' : 'attendance'}?
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={attendOrCancelEvent}>Yes</Button>
                            <Button onClick={handleClose}>No</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}
