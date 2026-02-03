import { Button, LinearProgress, TextField, Tooltip, Typography, Paper } from '@mui/material';
import authClient from '../../services/auth-client.ts';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { getSession } from '../../utilities/user-permissions.ts';
import { SocialMediaIconButtons } from '../../components/social-media-icon-buttons.tsx';
import { StyledPaper } from '../../components/simple-components/background-parent-components/background-parent-components.tsx';

export function RegisterPage() {
    const navigate = useNavigate();
    const user = getSession();
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
        await authClient.signUp.email(
            {
                name: name,
                email: email,
                password: password,
            },
            {
                onSuccess: () => {
                    navigate('/upcoming-events');
                },
            },
        );
    }

    return (
        <StyledPaper>
            {user ? (
                <Navigate to="/" />
            ) : (
                <Paper className="Register" sx={{ boxShadow: 'none' }}>
                    <Typography>Register</Typography>
                    <form
                        className="Register"
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
                        <Button
                            type="submit"
                            disabled={!(isValid && strength === 100)}
                            variant="contained"
                            color="success"
                        >
                            Submit
                        </Button>
                    </form>
                    <Button onClick={() => navigate('/')} color="success">
                        Login with password
                    </Button>
                    <SocialMediaIconButtons />
                </Paper>
            )}
        </StyledPaper>
    );
}
