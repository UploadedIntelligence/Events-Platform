import { Button, TextField, Typography } from '@mui/material';
import authClient from '../services/auth-client.ts';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export function LoginPage() {
    const { data, error } = authClient.useSession();

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

    if (error) {
        console.log('authClient error:', error);
    }

    let user_email = watch('email');
    let user_password = watch('password');

    async function emailSingIn() {
        const { data, error } = await authClient.signIn.email({
            email: user_email,
            password: user_password,
        });

        console.log('manual sign in error:', {data, error});
        if (error) {
            console.log('manual sign in error:', error);
        }
    }

    return (
        <div>
            {data ? (
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
                </div>
            )}
        </div>
    );
}
