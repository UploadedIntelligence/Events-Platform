import { Button, Dialog, DialogTitle, DialogActions, Alert } from '@mui/material';
import * as React from 'react';
import axios from '../config/client.ts';
import { useState } from 'react';

export function AttendOrCancelEventDialog({
    setEvents,
    dialogOpen,
    setDialogOpen,
    selectedEvent,
    isAttending,
}: {
    setEvents: React.Dispatch<React.SetStateAction<Array<any>>>;
    selectedEvent: any;
    isAttending: boolean;
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [success, setSuccess] = useState<boolean | null>(null);
    async function attendOrCancelEvent() {
        let events: any;
        console.log('confirming attendance or cancellation...', isAttending);
        const response = await axios.put(
            '/attend-or-cancel',
            { event_id: selectedEvent.id, is_attending: isAttending },
            { withCredentials: true },
        );
        console.log('success?', response.status);
        if (response.status === 200) {
            setSuccess(true);

            if (isAttending) {
                events = await axios.get('/attending', { withCredentials: true });
                setEvents(events.data);
            } else {
                events = await axios.get('/upcoming-events', { withCredentials: true });
                setEvents(events.data);
            }
        } else {
            setSuccess(false);
        }
    }

    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <div>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                slotProps={{
                    transition: {
                        onExited: () => setSuccess(null),
                    },
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {success ? (
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
