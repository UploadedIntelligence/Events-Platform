import { Button } from '@mui/material';
import authClient from '../services/auth-client.ts';
import { Navigate, redirect } from 'react-router-dom';

export function UserAuthenticated() {
    const { data, error } = authClient.useSession();

    async function logOut() {
        authClient.signOut();
    }
    console.log(data);

    return <>{!data ? <Navigate to="/user/login" /> : <Button onClick={logOut}>log out</Button>}</>;
}
