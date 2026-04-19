import { Alert, Snackbar } from '@mui/material';
import authClient from '../../../services/auth-client.ts';
import { useState } from 'react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { SocialMediaIconButtons } from '../../../components/social-media-icon-buttons/social-media-icon-buttons.tsx';
import { EpUserDataInput } from '../../../components/user-data-input/user-data-input.tsx';
import { EpButton } from '../../../components/button/button.tsx';
import { EpCredentialsPageContent } from '../../../components/credentials-page-content/credentials-page-content.tsx';
import { EpDivider } from '../../../components/divider/divider.tsx';
import { EpUserCredentialsForm } from '../../../components/user-credentials-form/user-credentials-form.tsx';
import dayjs from 'dayjs';

export function LoginPage() {
    const today = dayjs().format('YYYY-MM-DD-HH');
    const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);

    const {
        register,
        watch,
        formState: { isValid },
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
            callbackURL: `/events?fromDate=${today}`,
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
        <EpCredentialsPageContent>
            <h3>Log In</h3>
            <SocialMediaIconButtons />
            <EpDivider>Or continue with email</EpDivider>
            <EpUserCredentialsForm action={emailSingIn}>
                <EpUserDataInput
                    label="Email"
                    placeholder="name@company.com"
                    {...register('email', { required: true })}
                />
                <EpUserDataInput
                    label="Password"
                    placeholder="••••••••"
                    {...register('password', { required: true })}
                />
                <EpButton disabled={!isValid}>
                    Sign In <ArrowForwardIcon style={{ fontSize: '1.25em' }} />
                </EpButton>
            </EpUserCredentialsForm>
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
        </EpCredentialsPageContent>
    );
}
