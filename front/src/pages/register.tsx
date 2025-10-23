import { Button, LinearProgress, TextField, Tooltip, Typography } from '@mui/material';
import authClient from '../services/auth-client.ts';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { googleSignIn } from '../services/google-sign-in.ts';

export function RegisterPage() {
    const navigate = useNavigate();
    const { data, error } = authClient.useSession();
    const [strength, setStrength] = useState<number>(0);
    const {
        register,
        watch,
        trigger,
        formState: { errors, isValid, dirtyFields },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    let [name, email, password] = [watch('name'), watch('email'), watch('password')];

    useEffect(() => {
        trigger(['password', 'name']);
    }, [name, password]);

    if (error) {
        console.log('authClient error:', error);
    }

    const password_tooltip =
        'A strong password contains:\nAt least 8 characters\nOne upper case and one lower case letter\n' +
        'One or more digits\nOne or more symbols, such as #$%!';

    function passwordValidation(password: string) {
        const regexes: Array<RegExp> = [/\S{8,}/, /[a-z]/, /[A-Z]/, /\d/, /[^\w\s]/];
        if (password) {
            const result = regexes.reduce((accum: number, curr: RegExp): number => {
                return accum + Number(curr.test(password));
            }, 0);

            setStrength(result * (100 / regexes.length));

            if (/\s/.test(password)) {
                return 'SPACE not allowed';
            }
            return true;
        } else {
            setStrength(0);
            return false;
        }
    }

    async function emailRegister() {
        await authClient.signUp.email({
            name: name,
            email: email,
            password: password,
            role: 'user',
        });
    }

    return (
        <div>
            {data ? (
                <Navigate to="/" />
            ) : (
                <div className="register">
                    <Typography>Register</Typography>
                    <form
                        className="register"
                        onSubmit={(event) => {
                            event.preventDefault();
                            emailRegister();
                        }}
                    >
                        <TextField
                            label="Name"
                            error={!!errors.name?.message && dirtyFields.name}
                            helperText={errors.name?.message}
                            {...register('name', {
                                required: true,
                                pattern: {
                                    value: /^\w+$/,
                                    message: 'Only letters and numbers',
                                },
                            })}
                        />
                        <TextField
                            label="Email"
                            error={!!errors.email?.message && dirtyFields.email}
                            helperText={errors.email?.message}
                            {...register('email', {
                                required: true,
                                pattern: {
                                    value: /^[\w.-]+@[\w-]+\.[\w.-]+$/,
                                    message: 'Invalid email format',
                                },
                            })}
                            onBlur={() => trigger('email')}
                        />
                        <TextField
                            label="Password"
                            error={!!errors.password?.message && dirtyFields.password}
                            helperText={errors.password?.message}
                            {...register('password', {
                                required: true,
                                validate: passwordValidation,
                            })}
                        />
                        <Tooltip
                            placement="bottom"
                            title={password_tooltip.split('\n').map((line) => (
                                <Typography fontSize="14px">
                                    {line}
                                    <br />
                                </Typography>
                            ))}
                        >
                            <Typography sx={{ width: 'fit-content', justifySelf: 'center' }}>ℹ️ Strength: </Typography>
                        </Tooltip>
                        <LinearProgress variant="determinate" value={strength}></LinearProgress>
                        <Button type="submit" disabled={!(isValid && strength === 100)} variant="contained">
                            Submit
                        </Button>
                    </form>
                    <Button onClick={googleSignIn}>Google Signup/Login</Button>
                    <Button onClick={() => navigate('/')}>Login with password</Button>
                </div>
            )}
        </div>
    );
}
