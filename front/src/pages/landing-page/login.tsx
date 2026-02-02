import { Button, TextField, Typography, Alert, Snackbar, Paper } from '@mui/material';
import authClient from '../../services/auth-client.ts';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { getSession } from '../../utilities/user-permissions.ts';
import { SocialMediaIconButtons } from '../../components/social-media-icon-buttons.tsx';
import { StyledPaper } from '../../mui-styled-components';
import { GhostButton, PrimaryButton, SecondaryButton } from '../../mui-styled-components/buttons/buttons.tsx';

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
            callbackURL: '/upcoming-events',
        });

        if (error !== null) {
            setInvalidCredentials(true);
            console.log('manual sign in error:', { data, error });
        }
    }

    const handleClose = (event: React.SyntheticEvent | Event) => {
        if (event?.type === 'click') return;
        setInvalidCredentials(false);
    };

    return (
        <StyledPaper>
            {user ? (
                <Navigate to="/" />
            ) : (
                <Paper className="Login" sx={{ boxShadow: 'none' }}>
                    <Typography>Log In</Typography>
                    <form className="Login" action={emailSingIn}>
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
                        <Button type="submit" disabled={!isValid} variant="contained" color="success">
                            Submit
                        </Button>
                    </form>
                    <Button onClick={() => navigate('/register')} color="success">
                        Register
                    </Button>
                    <PrimaryButton>Primary Button</PrimaryButton>
                    <SecondaryButton>Secondary Button</SecondaryButton>
                    <GhostButton>Ghost button</GhostButton>
                    <SocialMediaIconButtons />
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
                </Paper>
            )}
        </StyledPaper>
    );
}
