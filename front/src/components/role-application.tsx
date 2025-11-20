import { Button } from '@mui/material';
import axios from '../config/client.ts';
import * as React from 'react';

export function RoleApplication({
    setApplicationStatus,
    setOpenAlert,
}: {
    setApplicationStatus: React.Dispatch<React.SetStateAction<'Idle' | 'Loading' | 'Success' | 'Error'>>;
    setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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

    return <Button onClick={applyStaff}>Become staff member</Button>;
}
