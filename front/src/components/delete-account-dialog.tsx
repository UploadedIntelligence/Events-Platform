import {
    Button,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import axios from '../config/client';
import { useState } from 'react';

export function DeleteAccount() {
    const [open, setOpen] = useState<boolean>(false);
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [status, setStatus] = useState<'Idle' | 'Loading' | 'Success' | 'Error'>('Idle');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function confirmDelete() {
        setStatus('Loading');
        try {
            axios.delete('/delete-account');
            setStatus('Success');
            setTimeout(() => window.location.reload(), 2500);
        } catch (e) {
            setStatus('Error');
            console.log(e);
        }
        setOpenAlert(true);
        setOpen(false);
    }

    return (
        <>
            <Button onClick={handleClickOpen}>Delete Account</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Delete account?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting your account is irreversible. Your Google Calendar events will be unaffected. Confirm
                        delete?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDelete}>Delete</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} onClose={handleClose} sx={{ position: 'inherit', justifyContent: 'center' }}>
                <Alert
                    variant="filled"
                    severity={status === 'Success' ? 'success' : 'error'}
                    sx={{ minWidth: '50%', justifyContent: 'center' }}
                >
                    {status === 'Success' ? 'Account deletion successful!' : 'Something went wrong!'}
                </Alert>
            </Snackbar>
        </>
    );
}
