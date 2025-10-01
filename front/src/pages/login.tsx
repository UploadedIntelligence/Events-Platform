import { Button } from '@mui/material';
import authClient from '../services/auth-client.ts';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
    const { data, error } = authClient.useSession();

    async function signIn() {
        const { data, error } = await authClient.signIn.social({
            provider: 'google',
            callbackURL: 'http://localhost:5173',
            errorCallbackURL: 'http://localhost:5173',
        });
        console.log('Data', data);
        if (error) {
            console.log('Error:', error);
        }
    }
    return <>{data ? <Navigate to='/' /> : <Button onClick={signIn}>Sign in with Google</Button>}</>;
}
