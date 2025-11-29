import { Button, TextField, Typography, Alert, Snackbar } from '@mui/material';
import authClient from '../../services/auth-client.ts';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { googleSignIn } from '../../services/google-sign-in.ts';
import {getSession} from "../../utilities/user-permissions.ts";

export function LoginPage() {
    const navigate = useNavigate();
    const user = getSession();
    const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);

    const {
        register,
        watch,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    let user_email = watch('email');
    let user_password = watch('password');

    async function emailSingIn() {
        const { data, error } = await authClient.signIn.email({
            email: user_email,
            password: user_password,
        });

        console.log('manual sign in error:', { data, error });
        if (error) {
            setInvalidCredentials(true);
            console.log('manual sign in error:', error);
        }
    }

    const handleClose = (event: React.SyntheticEvent | Event) => {
        if (event?.type === 'click') return;
        setInvalidCredentials(false);
    };

    return (
        <div>
            {user ? (
                <Navigate to="/" />
            ) : (
                <div className="login">
                    <Typography>Log In</Typography>
                    <form className="login" action={emailSingIn}>
                        <TextField
                            label="Email"
                            error={!!errors.email?.message}
                            helperText={errors.email?.message}
                            {...register('email', { required: 'Field required' })}
                        />
                        <TextField
                            label="Password"
                            error={!!errors.password?.message}
                            helperText={errors.password?.message}
                            {...register('password', { required: 'Field required' })}
                        />
                        <Button type="submit" disabled={!isValid} variant="contained">
                            Submit
                        </Button>
                    </form>
                    <Button onClick={() => navigate('/register')}>Register</Button>
                    <Button onClick={googleSignIn}>Google Signup/Login</Button>
                    <Snackbar
                        autoHideDuration={5000}
                        open={invalidCredentials}
                        onClose={handleClose}
                        sx={{ position: 'inherit' }}
                    >
                        <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
                            Invalid credentials.
                        </Alert>
                    </Snackbar>
                </div>
            )}
        </div>
    );
}
