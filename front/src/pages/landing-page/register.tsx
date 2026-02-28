import { LinearProgress, Tooltip, Typography } from '@mui/material';
import authClient from '../../services/auth-client.ts';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { SocialMediaIconButtons } from '../../components/social-media-icon-buttons/social-media-icon-buttons.tsx';
import { EpCredentialsPageContent } from '../../components/credentials-page-content/credentials-page-content.tsx';
import { EpUserCredentialsForm } from '../../components/user-credentials-form/user-credentials-form.tsx';
import { EpUserDataInput } from '../../components/user-data-input/user-data-input.tsx';
import { EpButton } from '../../components/button/button.tsx';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export function RegisterPage() {
    const navigate = useNavigate();
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
        <EpCredentialsPageContent>
            <h3>Register</h3>
            <SocialMediaIconButtons />
            <EpUserCredentialsForm
                onSubmit={(event) => {
                    event.preventDefault();
                    emailRegister();
                }}
            >
                <EpUserDataInput
                    label="Name"
                    placeholder="JoeBloggs112"
                    error={!!errors.name && dirtyFields.name}
                    helperText={errors.name?.message}
                    {...register('name', {
                        required: true,
                        pattern: {
                            value: /^\w+$/,
                            message: 'Only letters and numbers',
                        },
                    })}
                />
                <EpUserDataInput
                    label="Email"
                    error={!!errors.email && dirtyFields.email}
                    helperText={errors.email?.message}
                    placeholder="name@company.com"
                    {...register('email', {
                        required: true,
                        pattern: {
                            value: /^[\w.-]+@[\w-]+\.[\w.-]+$/,
                            message: 'Invalid email format',
                        },
                    })}
                    onBlur={() => trigger('email')}
                />
                <EpUserDataInput
                    label="Password"
                    placeholder="••••••••"
                    error={!!errors.password && dirtyFields.password}
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
                <EpButton type="submit" disabled={!(isValid && strength === 100)}>
                    Register <ArrowForwardIcon style={{ fontSize: '1.25em' }} />
                </EpButton>
            </EpUserCredentialsForm>
        </EpCredentialsPageContent>
    );
}
