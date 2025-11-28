import { Button, Snackbar, Alert } from '@mui/material';
import { useState } from "react";
import axios from '../config/client.ts';
import * as React from 'react';

export function RoleApplication() {
    const [applicationStatus, setApplicationStatus] = useState<'Idle' | 'Loading' | 'Success' | 'Error'>('Idle');
    const [openAlert, setOpenAlert] = useState<boolean>(false);

    async function applyStaff() {
        setApplicationStatus('Loading');
        try {
            await axios.post('/apply-staff', { role: 'staff' });
            setApplicationStatus('Success');
        } catch (e) {
            setApplicationStatus('Error');
        }
        setOpenAlert(true);
    }

    const handleClose = (event: React.SyntheticEvent | Event) => {
        if (event?.type === 'click') return;
        setOpenAlert(false);
    };

    return (
        <>
            <Button onClick={applyStaff}>Become staff member</Button>
            <Snackbar autoHideDuration={5000} open={openAlert} onClose={handleClose} sx={{ position: 'inherit', justifyContent: 'center' }}>
                <Alert
                    variant="filled"
                    severity={applicationStatus === 'Success' ? 'success' : 'error'}
                    sx={{ justifyContent: 'center', minWidth: '50%' }}
                >
                    {applicationStatus === 'Success' ? 'Application sent' : 'Application pending'}
                </Alert>
            </Snackbar>
        </>
    )
}
